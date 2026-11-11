import { events } from "../data/events.js";

const EVENT_MODES = ["yuz-yuze", "online", "hibrit"];

// GET /events?category=Atölye&q=sensör&minCapacity=50&mode=online
// Filtreler isteğe bağlıdır, birlikte kullanılabilir.
export function getEvents(req, res) {
  const { category, q, minCapacity, mode } = req.query;
  let list = category
    ? events.filter((event) => event.category === category)
    : events;

  // Sayısal kontenjan eşiği: en az belirtilen kadar kişilik etkinlikler.
  if (minCapacity !== undefined) {
    const minimum = Number(minCapacity);
    if (typeof minCapacity !== "string" || !minCapacity.trim() ||
        !Number.isFinite(minimum) || minimum < 0) {
      return res.status(400).json({
        error: { message: "minCapacity must be a non-negative number" },
      });
    }
    list = list.filter((event) => event.capacity >= minimum);
  }

  // Etkinlik katılım türü: yuz-yuze, online veya hibrit.
  if (mode !== undefined) {
    const selectedMode = typeof mode === "string"
      ? mode.trim().toLocaleLowerCase("tr-TR")
      : "";
    if (!EVENT_MODES.includes(selectedMode)) {
      return res.status(400).json({
        error: { message: "mode must be yuz-yuze, online or hibrit" },
      });
    }
    list = list.filter((event) => event.mode === selectedMode);
  }

  // Özgün arama özelliği: başlık, yer veya açıklama içinde arama.
  // Filtre verilmezse başlangıçtaki 6 etkinlik döner.
  if (typeof q === "string" && q.trim()) {
    const search = q.trim().toLocaleLowerCase("tr-TR");
    list = list.filter((event) =>
      [event.title, event.location, event.description].some((field) =>
        field.toLocaleLowerCase("tr-TR").includes(search),
      ),
    );
  }

  res.json(list);
}

// GET /events/:id
export function getEventById(req, res) {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: { message: "Event not found" } });
  }
  res.json(event);
}

// POST /events
export function createEvent(req, res) {
  const {
    title, category, capacity, date, time, location, description, mode = "yuz-yuze",
  } = req.body ?? {};

  if (!title || !category || !date) {
    return res.status(400).json({
      error: { message: "title, category and date are required" },
    });
  }

  if (typeof mode !== "string" || !EVENT_MODES.includes(mode)) {
    return res.status(400).json({
      error: { message: "mode must be yuz-yuze, online or hibrit" },
    });
  }

  const newEvent = {
    id: `event-${Date.now()}`,
    title,
    category,
    date,
    capacity: Number(capacity) || 0,
    time: time ?? "",
    location: location ?? "",
    description: description ?? "",
    mode,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
}
