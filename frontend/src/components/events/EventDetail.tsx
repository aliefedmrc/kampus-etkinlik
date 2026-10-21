import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventDetailProps {
  event: CampusEvent;
  onBack: () => void;
  onEdit: (id: string) => void;
}

function EventDetail({ event, onBack, onEdit }: EventDetailProps) {
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
          <a
            href="#update"
            onClick={olay => {
              olay.preventDefault();
              onEdit(event.id);
            }}
          >
            Bu etkinliği güncelle
          </a>
        </p>
        <p>
          <a
            href="#events"
            onClick={olay => {
              olay.preventDefault();
              onBack();
            }}
          >
            Listeye dön
          </a>
        </p>
      </div>
    </article>
  );
}

export default EventDetail;