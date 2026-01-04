import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js"
import ViewCache from "../utils/ViewCache.js";
import { User } from "../models/user.models.js";



//get all videos method written by chatgpt
const getAllvideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        filter.owner = userId;
    }

    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // Get videos
    const videosPromise = Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("owner", "username email avatar fullName")
        .lean();

    // Get total count for this specific filter (important for user-specific queries)
    const totalPromise = Video.countDocuments(filter);

    const [videos, totalVideos] = await Promise.all([videosPromise, totalPromise]);

    // If userId is provided, also get user info
    let userInfo = null;
    if (userId) {
        userInfo = await User.findById(userId).select("username fullName avatar").lean();
    }

    return res.status(200).json(new ApiResponse(200, {
        videos,
        total: totalVideos, // This is filtered total (user's total videos when userId provided)
        page: parseInt(page),
        totalPages: Math.ceil(totalVideos / parseInt(limit)),
        user: userInfo
    }, "Videos fetched successfully"));

});

//upload video method
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and Description are required");
    }

    // Get uploaded video file
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    // Get uploaded thumbnail file
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Upload video to Cloudinary
    const uploadedVideo = await uploadToCloudinary(videoLocalPath);
    if (!uploadedVideo) {
        throw new ApiError(500, "Failed to upload video");
    }

    // Upload thumbnail to Cloudinary
    const uploadedThumbnail = await uploadToCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    // Save to database
    const video = await Video.create({

        title,
        description,
        videoFile: uploadedVideo.secure_url,
        thumbnail: uploadedThumbnail.secure_url,
        duration: uploadedVideo.duration,
        owner: req.user._id,

    });

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));
});



const getVideoById = asyncHandler(async (req, res) => {
    //link theke video Id nibo
    const { videoId } = req.params;

    //Check if videoId exists in params.
    if (!videoId) {
        throw new ApiError(400, "Video ID not found in request params");
    }

    //Use Video.findById(videoId) to fetch the video.
    const video = await Video.findById(videoId)
        .populate("owner", "username email avatar fullName")
        .lean();


    //Throw 404 if not found.
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //Return the video in a consistent ApiResponse.
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, tags } = req.body;

    //update thambnail, title, description, tags

    if (!videoId) {
        throw new ApiError(400, "Video ID not found in request params");
    }
    const video = Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //if thumbnail is there in request, upload to cloudinary
    if (req.file) {
        const thumbnailLocalPath = req.file.path;

        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail file is required");
        }

        const uploadedThumbnail = await uploadToCloudinary(thumbnailLocalPath);
        if (!uploadedThumbnail.url) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }

        const updateVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    tags,
                    thumbnail: uploadedThumbnail.secure_url
                }
            },
            {
                new: true,
            }
        ).select("-videoFile -duration -viewCount -owner -isPublished");

    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    //delete video by id
    if (!videoId) {
        throw new ApiError(400, "Video ID not found in request params");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!")
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video deleted Successfully"));
});


const togglePublishVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished; // toggle
    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Publish status toggled")
        );
});





const addView = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Check if req.user exists (from verifyJWT)
    if (!req.user?._id) {
        return res.status(401).json({ message: "Login to count view" });
    }

    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Use .some() with .toString() for a reliable unique check
    const hasViewed = video.viewedBy.some(id => id.toString() === userId.toString());

    if (hasViewed) {
        return res.status(200).json({ success: true, message: "Already viewed" });
    }

    // 1. Add to in-memory cache for the global counter
    ViewCache.incrementView(videoId, userId.toString());

    // 2. Add to DB viewedBy list to prevent future counts
    video.viewedBy.push(userId);
    await video.save();

    return res.status(200).json({ success: true, message: "Unique view added" });
});
// Remove (req, res) because setInterval doesn't provide them
const flushViewsToDB = async () => {
    // 1. Get the data and clear the cache immediately
    const cachedViews = ViewCache.flushCache();

    const videoIds = Object.keys(cachedViews);
    if (videoIds.length === 0) return; // Don't hit DB if cache is empty

    // 2. Use bulkWrite (Much faster than Promise.all for many updates)
    const operations = videoIds.map(videoId => ({
        updateOne: {
            filter: { _id: videoId },
            update: { $inc: { viewCount: cachedViews[videoId] } }
        }
    }));

    try {
        await Video.bulkWrite(operations);
        console.log(`Successfully flushed ${videoIds.length} video(s) views to DB`);
    } catch (err) {
        console.error("Error flushing views:", err);

        // OPTIONAL: If DB fails, put the counts back so they aren't lost
        // for (const id in cachedViews) {
        //    viewCache.incrementView(id, cachedViews[id]); 
        // }
    }
};


const getVideosByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, sortBy = "createdAt", sortType = "desc" } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Validate userId
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Check if user exists
  const user = await User.findById(userId).select("_id username");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const filter = { owner: userId };
  
  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  const videosPromise = Video.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "username email avatar fullName")
    .lean();

  const totalPromise = Video.countDocuments(filter);

  const [videos, totalVideos] = await Promise.all([videosPromise, totalPromise]);

  return res.status(200).json(new ApiResponse(200, {
    videos,
    total: totalVideos,
    page: parseInt(page),
    totalPages: Math.ceil(totalVideos / parseInt(limit)),
    user: {
      _id: user._id,
      username: user.username
    }
  }, "User videos fetched successfully"));
});

// Get videos by username
const getVideosByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 20, sortBy = "createdAt", sortType = "desc" } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Find user by username
  const user = await User.findOne({ username }).select("_id username fullName avatar");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const filter = { owner: user._id };
  
  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  const videosPromise = Video.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "username email avatar fullName")
    .lean();

  const totalPromise = Video.countDocuments(filter);

  const [videos, totalVideos] = await Promise.all([videosPromise, totalPromise]);

  return res.status(200).json(new ApiResponse(200, {
    videos,
    total: totalVideos,
    page: parseInt(page),
    totalPages: Math.ceil(totalVideos / parseInt(limit)),
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    }
  }, "User videos fetched successfully"));
});

// Get total video count for a specific user
const getTotalVideosByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Validate userId
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Check if user exists
  const user = await User.findById(userId).select("_id username fullName");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get total video count for this user
  const totalVideos = await Video.countDocuments({ owner: userId });
  
  // Get video statistics (optional)
  const videoStats = await Video.aggregate([
    { $match: { owner: user._id } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$viewCount" },
        totalLikes: { $sum: "$likesCount" },
        totalDuration: { $sum: "$duration" },
        averageViews: { $avg: "$viewCount" }
      }
    }
  ]);

  const stats = videoStats[0] || {
    totalViews: 0,
    totalLikes: 0,
    totalDuration: 0,
    averageViews: 0
  };

  return res.status(200).json(new ApiResponse(200, {
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.fullName
    },
    totalVideos,
    statistics: {
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      totalDuration: stats.totalDuration,
      averageViews: Math.round(stats.averageViews || 0)
    }
  }, "Video statistics fetched successfully"));
});

// Alternative: Simple version without statistics
const getSimpleVideoCountByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }

  const totalVideos = await Video.countDocuments({ owner: userId });
  
  return res.status(200).json(new ApiResponse(200, {
    userId,
    totalVideos
  }, "Total videos count fetched successfully"));
});



export {
    getAllvideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishVideo,
    addView,
    flushViewsToDB,
    getTotalVideosByUserId,
    getSimpleVideoCountByUserId,
    getVideosByUsername,
    getVideosByUserId


}
