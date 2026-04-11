import express from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getSchedules);
router.post("/", protect, adminOnly, createSchedule);
router.put("/:id", protect, adminOnly, updateSchedule);
router.delete("/:id", protect, adminOnly, deleteSchedule);

export default router;