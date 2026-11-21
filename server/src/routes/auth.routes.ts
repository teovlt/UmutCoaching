import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

// Stops password guessing; successful logins don't count against the limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later" },
});

export const authRouter = Router();

authRouter.post("/login", loginLimiter, async (req, res) => {
  const { identifier, password } = (req.body ?? {}) as { identifier?: unknown; password?: unknown };
  if (typeof identifier !== "string" || typeof password !== "string" || !identifier || !password) {
    throw new HttpError(400, "Identifier and password are required");
  }

  const value = identifier.trim();
  const user = await User.findOne({ $or: [{ email: value.toLowerCase() }, { username: value }] }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid credentials");
  }

  res.json({ token: signToken({ userId: user.id }), user });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
