import express from "express";

const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    subscribe,
    unsubscribe,
    getSubscribers,
    isSubscribed
} from "../controllers/subscription.controller.js";

router.post("/:channelId/subscribe/", subscribe);

// Unsubscribe from a channel
router.post("/:channelId/unsubscribe", verifyJWT, unsubscribe);

// Get all subscribers of a channel
router.get("/subscriber/:channelId", verifyJWT, getSubscribers);

// Check if current user is subscribed to a channel
router.get("/is-subscribed/:channelId", verifyJWT, isSubscribed);


export default router;