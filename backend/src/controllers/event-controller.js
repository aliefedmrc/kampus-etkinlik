import mongoose from "mongoose";
import { Event, EVENT_MODES } from "../models/event-model.js";

// GET /events?category=Atölye&q=sensör&minCapacity=50&mode=online
export async function getEvents(req, res, next) {
  const { category, q, minCapacity, mode } = req.query;
  const filter = {};

  if (minCapacity !== undefined) {
    const minimum = Number(minCapacity);
    if (typeof minCapacity !== "string" || !minCapacity.trim() ||
        !Number.isFinite(minimum) || minimum < 0) {
      return res.status(400).json({
        error: { message: "minCapacity must be a non-negative number" },
      });
    }
    filter.capacity = { $gte: minimum };
  }

  if (mode !== undefined) {
    const selectedMode = typeof mode === "string" ? mode.trim().toLocaleLowerCase("tr-TR") : "";
    if (!EVENT_MODES.includes(selectedMode)) {
      return res.status(400).json({
        error: { message: "mode must be yuz-yuze, online or hibrit" },
      });
    }
    filter.mode = selectedMode;
  }

  if (category) {
    if (typeof category !== "string") return res.json([]);
    filter.category = category;
  }

  try {
    const events = await Event.find(filter).sort({ date: 1 });
    const search = typeof q === "string" ? q.trim().toLocaleLowerCase("tr-TR") : "";
    const result = search ? events.filter((event) =>
      [event.title, event.location, event.description].some((field) =>
        (field ?? "").toLocaleLowerCase("tr-TR").includes(search),
      ),
    ) : events;

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /events/:id
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = mongoose.isObjectIdOrHexString(id) ? await Event.findById(id) : null;
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
}

// POST /events
export async function createEvent(req, res, next) {
  const { title, category, capacity, date, time, location, description, mode } = req.body ?? {};

  try {
    const event = await Event.create({ title, category, capacity, date, time, location, description, mode });
    res.status(201).json(event);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: { message: error.message } });
    }
    next(error);
  }
}
