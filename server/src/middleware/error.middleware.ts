import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
};

// Express 5 forwards rejected promises from async handlers here on its own
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Fichier trop lourd (15 Mo max)" : err.message });
  }
  // Duplicate unique key, e.g. two programmes with the same slug
  if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
    return res.status(409).json({ message: "Cette valeur existe déjà" });
  }
  // Malformed JSON body
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
