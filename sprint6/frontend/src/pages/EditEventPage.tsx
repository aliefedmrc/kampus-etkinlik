import { useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/forms/EventForm";
import { useEvents } from "../context/useEvents";
import { findEventById } from "../utils/filter-events";
import NotFoundPage from "./NotFoundPage";

export default function EditEventPage() {
  const { id } = useParams();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();
  const event = findEventById(events, id ?? "");

  if (!event) return <NotFoundPage />;

  return (
    <>
      <h2>Etkinlik Güncelle</h2>
      <EventForm key={event.id} initial={event} onSave={data => {
        updateEvent(event.id, data);
        navigate("/admin");
      }} />
    </>
  );
}
