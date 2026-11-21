import { type InferSchemaType, Schema, model } from "mongoose";
import { displayFields, imageField, toJSON } from "./shared.js";

// A client testimonial. It cannot be saved without the client's written
// consent (CLAUDE.md, D8): `consent` must be true, and the date it was given
// is recorded.
const temoignageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    context: { type: String, default: "", trim: true },
    quote: { type: String, required: true, trim: true },
    // e.g. "−8 kg · 16 sem.", only a figure the client confirmed
    metric: { type: String, default: "", trim: true },
    consent: {
      type: Boolean,
      required: true,
      validate: { validator: (v: boolean) => v === true, message: "Le consentement écrit du client est obligatoire" },
    },
    consentDate: { type: Date, required: true },
    photo: imageField,
    ...displayFields,
  },
  { timestamps: true, toJSON },
);

export type TemoignageDocument = InferSchemaType<typeof temoignageSchema>;

export const Temoignage = model("Temoignage", temoignageSchema);
