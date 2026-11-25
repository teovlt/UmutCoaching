import type { SchemaDefinition } from "mongoose";

// Every editable collection can be hidden and reordered from /admin
export const displayFields = {
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
} satisfies SchemaDefinition;

// An uploaded image (URL from /api/uploads) and its alt text
export const imageField = {
  url: { type: String, default: "", trim: true },
  alt: { type: String, default: "", trim: true },
} satisfies SchemaDefinition;

// Sent as `id` instead of `_id`, without the version key
export const toJSON = {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

// English and Turkish versions of a document's texts (docs/05-decisions.md
// D25), edited in /admin. An empty field shows the French text instead.
// `fields` is called once per language so the two never share an object.
export const translations = (fields: () => SchemaDefinition) => ({
  i18n: { en: fields(), tr: fields() },
});

/** A translated text field */
export const text = () => ({ type: String, default: "", trim: true });
