import { type InferSchemaType, Schema, model } from "mongoose";
import { displayFields, text, toJSON, translations } from "./shared.js";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    // Where it is shown: "accueil", "tarifs", "programmes" or a programme slug
    pages: { type: [String], default: ["accueil"] },
    ...displayFields,
    ...translations(() => ({ question: text(), answer: text() })),
  },
  { timestamps: true, toJSON },
);

export type FaqDocument = InferSchemaType<typeof faqSchema>;

export const Faq = model("Faq", faqSchema);
