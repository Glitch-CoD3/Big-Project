import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//method for generate access and refresh token
const generateRefreshAndAccessTokens = async (userId) => {
    try {
        const user= await User.findById(userId);
        
        const accessToken= user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();

        //store refresh token in db
        user.refreshTokens = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Token generation failed, try again !");
    }
}



const registerUser = asyncHandler(async (req, res) => {
    //get user data from frontend
    const { fullName, username, email, password } = req.body;
    //console.log("Full Name:",fullName);



    //validation (correct emial, user name, not empty password etc)
    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required");    //import ApiError
    // }    I can use this for every field or following below

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    //check if user already exists - username or email

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "Already registered  !")
    }


    //check for image and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;   //access files from database models

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    //I also check for cover image if I want to make it required




    //upload them to cloudinary, check again avatar uploaded or not
    /*first import cloudinary function */
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Avatar is not uploaded, try again !")
    }



    //create user object- create entry in db
    const user = await User.create(
        {
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            username: username.toLowerCase(),
            email,
            password,

        }
    )

    //removed password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    //check for user creation success

    if (!createdUser) {
        throw new ApiError(500, "User registration failed, try again !")
    }


    //return response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})


//user login

const loginUser= asyncHandler(async(req,res)=>{
    //req body ->data
    const {username, email, password} = req.body

    //check username or emial provided
    if( !(username || email) ){
        throw new ApiError(400,"Username or email is required");
    }

    //find the user by email or username
    const user= await User.findOne({
        $or: [{username},{email}]
    })

    //if user not found
    if(!user){
        throw new ApiError(404,"User not found, please register !");
    }

    //password check
    const isPasswordMatched= await user.isPasswordCorrect(password);

    if(!isPasswordMatched){
        throw new ApiError(401,"Invalid credentials, password mismatch !");
    }

    //access and refresh token
    const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user._id); 

    //again call database
    const loggedInUser= await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    //send cookies
    const cookieOptions= {
        httpOnly: true,
        secure: true,
    };

    //response
    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully")
    );
    
})


//Logout user
const logOutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
    
        },
        
        {
            new: true,
        }
    )

    const cookieOptions= {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .clearCookie("accessToken ", cookieOptions)
    .clearCookie("refreshToken ", cookieOptions)
    .json( new ApiResponse(200, {}, "User Logged Out"))
})


export { registerUser, loginUser, logOutUser };













//process all steps
//get user data from frontend
//validation (correct emial, user name, not empty password etc)
//check if user already exists - username or email
//check for image and avatar
//upload them to cloudinary, avatar
//create user object- create entry in db
//removed password and refresh token field from response
//check for user creation success
//return response