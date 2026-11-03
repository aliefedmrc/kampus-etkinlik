import { createContext, useContext } from "react";
import type { CampusEvent } from "../types/campus-event";

export type EventValues = Omit<CampusEvent, "id" | "image">;

interface EventsContextValue {
  events: CampusEvent[];
  addEvent: (data: EventValues) => void;
  updateEvent: (id: string, data: EventValues) => void;
  deleteEvent: (id: string) => void;
}

export const EventsContext = createContext<EventsContextValue | null>(null);

export function useEvents() {
  const value = useContext(EventsContext);
  if (!value) throw new Error("EventsProvider bulunamadı.");
  return value;
}
