import express from "express";
import { getAnnouncements, createAnnouncement } from "../controllers/announcementController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);

export default router;