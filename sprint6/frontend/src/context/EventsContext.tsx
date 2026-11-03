import { useState } from "react";
import type { ReactNode } from "react";
import { events as initialEvents } from "../data/events";
import { EventsContext } from "./useEvents";
import type { EventValues } from "./useEvents";

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState(initialEvents);

  function addEvent(data: EventValues) {
    const id = crypto.randomUUID();
    setEvents(current => [...current, { ...data, id }]);
  }

  function updateEvent(id: string, data: EventValues) {
    setEvents(current => current.map(event => event.id === id ? { ...event, ...data } : event));
  }

  function deleteEvent(id: string) {
    setEvents(current => current.filter(event => event.id !== id));
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}
