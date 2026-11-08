import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/mine", protect, getMyProperties); // /:id se PEHLE rakhna zaroori hai
router.get("/:id", getProperty);

router.post("/", protect, upload.array("images", 4), createProperty);
router.put("/:id", protect, upload.array("images", 4), updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;