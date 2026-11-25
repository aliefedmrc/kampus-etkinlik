import mongoose from "mongoose";
import { Event, EVENT_MODES } from "../models/event-model.js";
import { todayStart } from "../utils/date.js";

const PROTECTED_FIELDS = ["_id", "createdAt", "updatedAt", "__v"];
const EDITABLE_FIELDS = ["title", "category", "capacity", "date", "time", "location", "description", "mode"];

function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

function handleWriteError(error, res, next) {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: error.message } });
  }
  next(error);
}

// GET /events?search=atölye&category=Atölye
export async function getEvents(req, res, next) {
  const { category, search, q, minCapacity, mode } = req.query;
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

  if (search !== undefined) {
    if (typeof search !== "string") {
      return res.status(400).json({ error: { message: "search must be a string" } });
    }
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (escapedSearch) filter.title = { $regex: escapedSearch, $options: "i" };
  }

  try {
    const events = await Event.find(filter).sort({ date: 1 });
    const keyword = typeof q === "string" ? q.trim().toLocaleLowerCase("tr-TR") : "";
    const result = keyword ? events.filter((event) =>
      [event.title, event.location, event.description].some((field) =>
        (field ?? "").toLocaleLowerCase("tr-TR").includes(keyword),
      ),
    ) : events;

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /events/upcoming
export async function getUpcomingEvents(req, res, next) {
  try {
    const events = await Event.find({ date: { $gte: todayStart() } }).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
}

// GET /events/:id
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = mongoose.isObjectIdOrHexString(id) ? await Event.findById(id) : null;
    if (!event) return notFound(res);
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
    handleWriteError(error, res, next);
  }
}

// PATCH /events/:id
export async function updateEvent(req, res, next) {
  const { id } = req.params;
  if (!mongoose.isObjectIdOrHexString(id)) return notFound(res);

  const body = req.body ?? {};
  if (typeof body !== "object" || Array.isArray(body) || Object.keys(body).length === 0) {
    return res.status(400).json({ error: { message: "Body is empty or invalid" } });
  }
  const protectedFields = Object.keys(body).filter((field) => PROTECTED_FIELDS.includes(field));
  if (protectedFields.length) {
    return res.status(400).json({ error: { message: `${protectedFields.join(", ")} cannot be changed` } });
  }
  const unknownFields = Object.keys(body).filter((field) => !EDITABLE_FIELDS.includes(field));
  if (unknownFields.length) {
    return res.status(400).json({ error: { message: `${unknownFields.join(", ")} cannot be changed` } });
  }

  try {
    const event = await Event.findByIdAndUpdate(id, { $set: body }, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (error) {
    handleWriteError(error, res, next);
  }
}

// DELETE /events/:id
export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) return notFound(res);
    const event = await Event.findByIdAndDelete(id);
    if (!event) return notFound(res);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
