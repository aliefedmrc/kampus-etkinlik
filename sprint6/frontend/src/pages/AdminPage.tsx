import { Link } from "react-router-dom";
import { useEvents } from "../context/useEvents";
import { formatDate } from "../utils/format-date";

export default function AdminPage() {
  const { events, deleteEvent } = useEvents();

  return (
    <>
      <h2>Etkinlik Yönetimi</h2>
      <p><Link className="buton" to="/admin/new">+ Yeni etkinlik</Link></p>
      {events.length === 0 ? <p>Henüz etkinlik yok.</p> : (
        <table className="tablo" aria-label="Yönetilen etkinlikler">
          <thead>
            <tr>
              <th scope="col">Etkinlik</th>
              <th scope="col">Kategori</th>
              <th scope="col">Tarih</th>
              <th scope="col">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td data-baslik="Etkinlik"><Link to={`/events/${event.id}`}>{event.title}</Link></td>
                <td data-baslik="Kategori">{event.category}</td>
                <td data-baslik="Tarih">{formatDate(event.date)}</td>
                <td>
                  <div className="islemler">
                    <Link className="buton" to={`/admin/${event.id}/edit`}>Düzenle</Link>
                    <button type="button" className="buton buton-sil" onClick={() => {
                      if (window.confirm(`“${event.title}” etkinliği silinsin mi?`)) deleteEvent(event.id);
                    }}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
