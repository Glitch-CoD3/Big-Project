import { Subscription } from "../models/subcription.model.js";

// Subscribe to a channel
export const subscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const subscriberId = req.user._id;

    if (!channelId) return res.status(400).json({ message: "Channel ID is required" });

    if (subscriberId.toString() === channelId.toString()) {
      return res.status(400).json({ message: "Cannot subscribe to yourself." });
    }

    const existing = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });
    if (existing) return res.status(400).json({ message: "Already subscribed." });

    const newSubscription = new Subscription({ subscriber: subscriberId, channel: channelId });
    await newSubscription.save();

    res.status(201).json({ message: "Subscribed successfully.", subscription: newSubscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Unsubscribe from a channel
export const unsubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const subscriberId = req.user.id;

    const deleted = await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      channel: channelId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all subscribers of a channel
export const getSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username avatar");

    res.status(200).json({ subscribers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// Check subscription status
export const isSubscribed = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user.id;

    const subscription = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });

    res.status(200).json({ subscribed: !!subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
