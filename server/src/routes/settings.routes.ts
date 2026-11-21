import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";
import { getSettings } from "../models/Settings.js";

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  res.json(await getSettings());
});

settingsRouter.put("/", requireAuth, async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) throw new HttpError(400, "Expected a JSON object");
  const { _id, id, key, __v, createdAt, updatedAt, ...data } = req.body as Record<string, unknown>;
  const settings = await getSettings();
  settings.set(data);
  await settings.save();
  res.json(settings);
});
