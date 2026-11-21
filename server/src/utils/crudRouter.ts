import { type Request, Router } from "express";
import { type Model, isValidObjectId } from "mongoose";
import { requireAuth } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";

type CrudOptions = {
  sort?: Record<string, 1 | -1>;
};

const readOnlyFields = ["_id", "id", "__v", "createdAt", "updatedAt"];

const cleanBody = (req: Request) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) throw new HttpError(400, "Expected a JSON object");
  const data: Record<string, unknown> = { ...req.body };
  for (const field of readOnlyFields) delete data[field];
  return data;
};

const assertId = (id: unknown): string => {
  if (typeof id !== "string" || !isValidObjectId(id)) throw new HttpError(400, "Invalid id");
  return id;
};

// Standard collection endpoints, adapted from portfolioFreelance:
// GET / (public, visible items only), GET /admin (everything), POST, PUT
// /reorder, PUT /:id, DELETE /:id. Every write requires authentication.
// Express 5 forwards rejected promises to the error handler.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCrudRouter = (model: Model<any>, { sort = { order: 1, createdAt: 1 } }: CrudOptions = {}) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    res.json(await model.find({ visible: true }).sort(sort));
  });

  router.get("/admin", requireAuth, async (_req, res) => {
    res.json(await model.find().sort(sort));
  });

  router.post("/", requireAuth, async (req, res) => {
    const data = cleanBody(req);
    if (data.order === undefined) {
      const last = await model.findOne().sort({ order: -1 });
      data.order = last ? last.order + 1 : 0;
    }
    res.status(201).json(await model.create(data));
  });

  // Declared before "/:id" so "reorder" isn't read as an id
  router.put("/reorder", requireAuth, async (req, res) => {
    const ids: unknown = req.body?.ids;
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && isValidObjectId(id))) {
      throw new HttpError(400, "ids must be an array of ids");
    }
    await model.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })));
    res.json(await model.find().sort(sort));
  });

  router.put("/:id", requireAuth, async (req, res) => {
    const doc = await model.findByIdAndUpdate(assertId(req.params.id), cleanBody(req), { returnDocument: "after", runValidators: true });
    if (!doc) throw new HttpError(404, "Not found");
    res.json(doc);
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    const doc = await model.findByIdAndDelete(assertId(req.params.id));
    if (!doc) throw new HttpError(404, "Not found");
    res.status(204).send();
  });

  return router;
};
