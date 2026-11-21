import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { faqRouter, programmeRouter, temoignageRouter } from "./routes/content.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";

const app = express();

// In production requests go through Traefik then nginx; trusting exactly those
// two hops gives the real client IP to the rate limiter without letting
// clients spoof it through X-Forwarded-For
app.set("trust proxy", process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : 0);
app.disable("x-powered-by");

// The admin and the site are served from the same origin as /api (nginx), so
// no CORS is needed
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/programmes", programmeRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/temoignages", temoignageRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/uploads", uploadRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API listening on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
