import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);