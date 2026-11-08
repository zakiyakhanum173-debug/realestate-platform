import express from "express";
import {
  createGuestAppointment,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/guest", createGuestAppointment);
router.get("/mine", protect, getMyAppointments);
router.post("/", protect, createAppointment);
router.put("/:id/cancel", protect, cancelAppointment);

export default router;