import { Router } from "express";
import mongoose from "mongoose";

// Used by the Docker healthcheck and by the site to know the API is up
export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const db = mongoose.connection.readyState === 1 ? "up" : "down";
  res.status(db === "up" ? 200 : 503).json({ status: db === "up" ? "ok" : "degraded", db });
});
