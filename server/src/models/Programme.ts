import { type InferSchemaType, Schema, model } from "mongoose";
import { displayFields, imageField, text, toJSON, translations } from "./shared.js";

// One offer: shown as a card, on /programmes/[slug] and in the /tarifs grid.
// Prices live here so Umut edits them in one place.
const programmeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    summary: { type: String, default: "", trim: true },
    audience: { type: String, default: "", trim: true },
    format: { type: String, enum: ["salle", "en-ligne", "hybride"], required: true },
    // Free text shown in the card's meta line, e.g. "60 min" or "12 sem."
    duration: { type: String, default: "", trim: true },
    // Undefined = no price confirmed yet ([À CONFIRMER] on the site)
    priceFrom: { type: Number, min: 0 },
    // e.g. "/ mois", "/ séance"
    priceUnit: { type: String, default: "", trim: true },
    // Replaces the price when set, e.g. "sur devis"
    priceLabel: { type: String, default: "", trim: true },
    currency: { type: String, enum: ["CHF", "EUR"], default: "EUR" },
    includes: { type: [String], default: [] },
    steps: { type: [{ label: { type: String, trim: true }, text: { type: String, trim: true } }], default: [] },
    // At most one programme should be featured ("Recommandé" on /tarifs)
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["new", "available", "few", "full", ""], default: "" },
    image: imageField,
    ...displayFields,
    ...translations(() => ({
      title: text(),
      summary: text(),
      audience: text(),
      duration: text(),
      priceUnit: text(),
      priceLabel: text(),
      includes: { type: [String], default: [] },
      steps: { type: [{ label: { type: String, trim: true }, text: { type: String, trim: true } }], default: [] },
    })),
  },
  { timestamps: true, toJSON },
);

export type ProgrammeDocument = InferSchemaType<typeof programmeSchema>;

export const Programme = model("Programme", programmeSchema);
