import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 400 }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "AgriTrade API is healthy" }));
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", resourceRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
