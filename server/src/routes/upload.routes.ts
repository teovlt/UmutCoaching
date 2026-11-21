import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express, { type RequestHandler, Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { requireAuth } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";

export const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// SVG is left out on purpose: it can carry scripts and is served from our origin
const accepted = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (accepted.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, "Formats acceptés : JPG, PNG, WebP, AVIF ou HEIC"));
  },
});

const MAX_SIDE = 2000;

// Phone photos arrive at several MB: turn every upload into a WebP at most
// 2000 px on its longest side, rotated upright and stripped of metadata
// (EXIF can hold the GPS position where the photo was taken).
const toWebp: RequestHandler = async (req, res, next) => {
  const file = req.file;
  if (!file) throw new HttpError(400, "Aucun fichier reçu");
  let image;
  try {
    image = sharp(file.buffer).rotate().resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });
  } catch {
    throw new HttpError(400, "Image illisible");
  }
  const { data, info } = await image
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true })
    .catch(() => {
      throw new HttpError(400, "Image illisible");
    });
  const filename = `${crypto.randomBytes(12).toString("hex")}.webp`;
  await fs.promises.writeFile(path.join(uploadDir, filename), data);
  res.status(201).json({ url: `/api/uploads/${filename}`, width: info.width, height: info.height });
};

export const uploadRouter = Router();

uploadRouter.post("/", requireAuth, upload.single("file"), toWebp);

// Filenames are random and never reused, so they can be cached forever
uploadRouter.use(express.static(uploadDir, { immutable: true, maxAge: "1y", index: false }));
