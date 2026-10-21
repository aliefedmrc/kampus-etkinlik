import { events } from "../../data/events";

interface EventFormProps {
  onSubmit: () => void;
  submitLabel?: string;
}

const categories = [...new Set(events.map(event => event.category))];

function EventForm({
  onSubmit,
  submitLabel = "Kaydet"
}: EventFormProps) {
  return (
    <>
      <p>
        Bu sprintte form yalnızca görünüm içindir.
        Bilgiler kaydedilmez veya güncellenmez.
      </p>

      <form
        className="etkinlik-formu"
        noValidate
        onSubmit={olay => {
          olay.preventDefault();
          onSubmit();
        }}
      >
        <p>
          <label htmlFor="ad">Etkinlik Adı *</label>
          <input
            type="text"
            id="ad"
            name="ad"
            maxLength={80}
            placeholder="Örn. Kariyer Günleri 2026"
            required
          />
        </p>

        <p>
          <label htmlFor="kategori">Kategori *</label>
          <select
            id="kategori"
            name="kategori"
            defaultValue=""
            required
          >
            <option value="">Seçiniz</option>
            {categories.map(kategori => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
        </p>

        <p>
          <label htmlFor="tarih">Tarih *</label>
          <input type="date" id="tarih" name="tarih" required />
        </p>

        <p>
          <label htmlFor="saat">Saat *</label>
          <input type="time" id="saat" name="saat" required />
        </p>

        <p>
          <label htmlFor="yer">Yer *</label>
          <input
            type="text"
            id="yer"
            name="yer"
            maxLength={80}
            placeholder="Örn. A Blok Konferans Salonu"
            required
          />
        </p>

        <p>
          <label htmlFor="kontenjan">Kontenjan</label>
          <input
            type="number"
            id="kontenjan"
            name="kontenjan"
            min={1}
            max={1000}
          />
        </p>

        <p>
          <label htmlFor="aciklama">Açıklama</label>
          <textarea id="aciklama" name="aciklama" rows={5} />
        </p>

        <p>
          <button type="submit">{submitLabel}</button>
          <button type="reset">Temizle</button>
        </p>
      </form>
    </>
  );
}

export default EventForm;