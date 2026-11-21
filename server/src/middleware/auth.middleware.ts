import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import { User, type UserDocument } from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserDocument>;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  if (!token) {
    res.status(401).json({ message: "Missing authorization token" });
    return;
  }

  let userId: string;
  try {
    userId = verifyToken(token).userId;
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ message: "User no longer exists" });
    return;
  }
  req.user = user;
  next();
};
