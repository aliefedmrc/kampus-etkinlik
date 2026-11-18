import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { Event } from "./models/event-model.js";
import { seedEvents } from "./data/seed-events.js";

try {
  await connectDatabase();
  await Promise.all(seedEvents.map((event) => new Event(event).validate()));
  await Event.deleteMany({});
  const inserted = await Event.insertMany(seedEvents);
  console.log(`${inserted.length} etkinlik eklendi`);
} catch (error) {
  console.error(`Seed tamamlanamadı (${error.name}).`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
