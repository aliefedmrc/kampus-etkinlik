import { useParams } from "react-router-dom";
import EventDetail from "../components/events/EventDetail";
import { useEvents } from "../context/useEvents";
import { findEventById } from "../utils/filter-events";
import NotFoundPage from "./NotFoundPage";

export default function EventDetailPage() {
  const { id } = useParams();
  const { events } = useEvents();
  const event = findEventById(events, id ?? "");

  if (!event) return <NotFoundPage />;

  return (
    <>
      <h2>{event.title}</h2>
      <EventDetail event={event} />
    </>
  );
}
