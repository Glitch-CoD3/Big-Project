import express from "express";

const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    subscribe,
    unsubscribe,
    getSubscribers,
    isSubscribed
} from "../controllers/subscription.controller.js";

router.post("/subscriptions/subscribe", subscribe);

// Unsubscribe from a channel
router.post("/subscriptions/unsubscribe", verifyJWT, unsubscribe);

// Get all subscribers of a channel
router.get("/subscribers/:channelId", verifyJWT, getSubscribers);

// Check if current user is subscribed to a channel
router.get("/is-subscribed/:channelId", verifyJWT, isSubscribed);
export default router;