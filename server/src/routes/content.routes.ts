import { Faq } from "../models/Faq.js";
import { Programme } from "../models/Programme.js";
import { Temoignage } from "../models/Temoignage.js";
import { HttpError } from "../middleware/error.middleware.js";
import { createCrudRouter } from "../utils/crudRouter.js";

export const programmeRouter = createCrudRouter(Programme);

// One programme's page (/programmes/[slug]); hidden ones are not served
programmeRouter.get("/slug/:slug", async (req, res) => {
  const programme = await Programme.findOne({ slug: req.params.slug, visible: true });
  if (!programme) throw new HttpError(404, "Not found");
  res.json(programme);
});

export const faqRouter = createCrudRouter(Faq);

export const temoignageRouter = createCrudRouter(Temoignage);
