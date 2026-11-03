import type { CampusEvent } from "../../types/campus-event";
import EventCard from "./EventCard";

export default function EventList({ events, label, all = false }: {
  events: CampusEvent[];
  label: string;
  all?: boolean;
}) {
  return (
    <section className={all ? "etkinlik-kartlari tum-etkinlikler" : "etkinlik-kartlari"} aria-label={label}>
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </section>
  );
}
