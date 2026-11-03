import { Link } from "react-router-dom";
import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

export default function EventDetail({ event }: { event: CampusEvent }) {
  return (
    <article
      className={
        event.image
          ? "etkinlik-detayi"
          : "etkinlik-detayi afissiz"
      }
    >
      {event.image && (
        <figure>
          <img
            src={event.image}
            alt={`${event.title} afişi`}
            width={480}
            height={270}
          />
          <figcaption>{event.title}</figcaption>
        </figure>
      )}

      <div className="detay-bilgileri">
        <div className="kunye-kutusu">
          <h2>Etkinlik Künyesi</h2>
          <dl>
            <dt>Tarih</dt>
            <dd>
              <time dateTime={`${event.date}T${event.time}`}>
                {formatDate(event.date)}, {event.time}
              </time>
            </dd>
            <dt>Yer</dt>
            <dd>{event.location}</dd>
            <dt>Kategori</dt>
            <dd>{event.category}</dd>
            <dt>Kontenjan</dt>
            <dd>{event.capacity} kişi</dd>
          </dl>
        </div>

        <h2>Açıklama</h2>
        <p>{event.description}</p>

        <p>
          <Link to={`/admin/${event.id}/edit`}>
            Bu etkinliği güncelle
          </Link>
        </p>
        <p>
          <Link to="/events">
            Listeye dön
          </Link>
        </p>
      </div>
    </article>
  );
}
