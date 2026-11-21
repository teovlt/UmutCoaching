import { type InferSchemaType, Schema, model } from "mongoose";
import { toJSON } from "./shared.js";

// A request sent from the contact form on /reserver, read in /admin
const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    goal: { type: String, default: "", trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON },
);

export type MessageDocument = InferSchemaType<typeof messageSchema>;

export const Message = model("Message", messageSchema);
