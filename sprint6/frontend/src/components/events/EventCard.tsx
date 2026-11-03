import { Link } from "react-router-dom";
import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

export default function EventCard({ event }: { event: CampusEvent }) {
  return (
    <article className="etkinlik-karti">
      <h3>{event.title}</h3>
      <p>Kategori: {event.category}</p>
      <p>
        Tarih:{" "}
        <time dateTime={`${event.date}T${event.time}`}>
          {formatDate(event.date)}, {event.time}
        </time>
      </p>
      <p>Yer: {event.location}</p>
      <p>Kontenjan: {event.capacity} kişi</p>
      <p>{event.description}</p>
      <Link to={`/events/${event.id}`}>
        Detayları gör →
      </Link>
    </article>
  );
}
