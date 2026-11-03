import { useNavigate } from "react-router-dom";
import EventForm from "../components/forms/EventForm";
import { useEvents } from "../context/useEvents";

export default function AddEventPage() {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <>
      <h2>Etkinlik Ekle</h2>
      <EventForm onSave={data => {
        addEvent(data);
        navigate("/admin");
      }} />
    </>
  );
}
