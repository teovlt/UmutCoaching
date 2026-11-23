import { Router } from "express";
import rateLimit from "express-rate-limit";
import { isValidObjectId } from "mongoose";
import { requireAuth } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";
import { Message } from "../models/Message.js";

// Contact form on /reserver: public, so rate limited and with a honeypot
const sendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Trop de messages envoyés. Réessayez plus tard ou écrivez directement par e-mail." },
});

const text = (value: unknown) => (typeof value === "string" ? value : "");

export const messageRouter = Router();

messageRouter.post("/", sendLimiter, async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  // Hidden "website" field: humans leave it empty, bots fill it in.
  // Answer as if it worked so they don't adapt.
  if (text(body.website)) {
    res.status(201).json({ ok: true });
    return;
  }
  await Message.create({
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone),
    goal: text(body.goal),
    message: text(body.message),
  });
  res.status(201).json({ ok: true });
});

messageRouter.get("/", requireAuth, async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }));
});

messageRouter.patch("/:id", requireAuth, async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid id");
  const read = (req.body as { read?: unknown } | undefined)?.read;
  if (typeof read !== "boolean") throw new HttpError(400, "read must be a boolean");
  const message = await Message.findByIdAndUpdate(req.params.id, { read }, { returnDocument: "after" });
  if (!message) throw new HttpError(404, "Not found");
  res.json(message);
});

messageRouter.delete("/:id", requireAuth, async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid id");
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw new HttpError(404, "Not found");
  res.status(204).send();
});
