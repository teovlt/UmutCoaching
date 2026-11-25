import { type InferSchemaType, Schema, model } from "mongoose";
import { imageField, text, toJSON, translations } from "./shared.js";

// The site's global details, a single document edited from /admin.
// Empty strings mean "not confirmed": the site then shows its
// [À CONFIRMER] defaults from src/data/site.ts.
const settingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true, immutable: true },
    city: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    currency: { type: String, enum: ["CHF", "EUR"], default: "EUR" },
    gym: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    hours: { type: String, default: "", trim: true },
    bookingUrl: { type: String, default: "", trim: true },
    socials: { type: [{ label: { type: String, trim: true }, url: { type: String, trim: true } }], default: [] },
    // Key-figures band on the home page; a metric without a value is hidden
    metrics: {
      type: [{ value: { type: String, trim: true }, unit: { type: String, trim: true }, label: { type: String, trim: true } }],
      default: [],
    },
    about: {
      title: { type: String, default: "", trim: true },
      text: { type: String, default: "", trim: true },
      tags: { type: [String], default: [] },
    },
    photos: {
      hero: imageField,
      about: imageField,
    },
    // Conditions listed under the prices (home page and /tarifs)
    pricingTerms: { type: [String], default: [] },
    // Legal notice (/mentions-legales)
    legal: {
      name: { type: String, default: "", trim: true },
      status: { type: String, default: "", trim: true },
      siret: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
      vat: { type: String, default: "", trim: true },
      qualification: { type: String, default: "", trim: true },
      insurance: { type: String, default: "", trim: true },
      host: { type: String, default: "", trim: true },
    },
    // Worded fields of "Infos du site" in English and Turkish
    ...translations(() => ({
      hours: text(),
      aboutTitle: text(),
      aboutText: text(),
      aboutTags: { type: [String], default: [] },
      pricingTerms: { type: [String], default: [] },
      metrics: {
        type: [{ value: { type: String, trim: true }, unit: { type: String, trim: true }, label: { type: String, trim: true } }],
        default: [],
      },
    })),
  },
  { timestamps: true, toJSON },
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema>;

export const Settings = model("Settings", settingsSchema);

/** The single settings document, created empty on first read */
export const getSettings = async () => (await Settings.findOne({ key: "site" })) ?? (await Settings.create({ key: "site" }));
