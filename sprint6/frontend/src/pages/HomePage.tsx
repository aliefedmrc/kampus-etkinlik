import { Link } from "react-router-dom";
import EventList from "../components/events/EventList";
import { useEvents } from "../context/useEvents";

export default function HomePage() {
  const { events } = useEvents();
  const upcoming = [...events]
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 2);

  return (
    <>
      <p>Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.</p>
      <h2>Yaklaşan Etkinlikler</h2>
      <EventList events={upcoming} label="Yaklaşan etkinlikler" />
      <p><Link to="/events">Tüm etkinlikleri gör →</Link></p>
    </>
  );
}
