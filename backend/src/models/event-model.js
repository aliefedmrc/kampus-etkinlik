import mongoose from "mongoose";
import { formatDate, parseDate } from "../utils/date.js";

export const EVENT_MODES = ["yuz-yuze", "online", "hibrit"];

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  category: { type: String, required: true, enum: ["Seminer", "Atölye", "Söyleşi", "Yarışma"] },
  capacity: { type: Number, min: 0, default: 0 },
  date: { type: Date, required: true, set: parseDate, get: formatDate },
  time: { type: String, default: "" },
  location: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, maxlength: 500, default: "" },
  mode: { type: String, required: true, enum: EVENT_MODES, default: "yuz-yuze" },
}, { timestamps: true, toJSON: { getters: true }, id: false });

export const Event = mongoose.model("Event", eventSchema);
