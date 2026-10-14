import { useEffect, useState } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import {
  searchEvents,
  filterByCategory,
  findEventById
} from "./utils/filter-events";

type PageName = "home" | "events" | "detail" | "add" | "update";

const basliklar: Record<PageName, string> = {
  home: "Kampüs Etkinlikleri",
  events: "Etkinlik Listesi",
  detail: "Etkinlik Detayı",
  add: "Etkinlik Ekle",
  update: "Etkinlik Güncelle"
};

const menu: { page: PageName; label: string }[] = [
  { page: "home", label: "Ana Sayfa" },
  { page: "events", label: "Etkinlikler" },
  { page: "add", label: "Etkinlik Ekle" }
];

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const categories = [...new Set(events.map(event => event.category))];

  const filtered = filterByCategory(
    searchEvents(events, searchText),
    category
  );

  const selected = selectedId
    ? findEventById(events, selectedId)
    : undefined;

  const title = page === "detail"
    ? selected?.title ?? "Etkinlik bulunamadı"
    : basliklar[page];

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  const upcoming = [...events]
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    )
    .slice(0, 2);

  function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function renderCard(event: CampusEvent) {
    return (
      <article className="etkinlik-karti" key={event.id}>
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
        <a
          href={`#detail-${event.id}`}
          onClick={olay => {
            olay.preventDefault();
            go("detail", event.id);
          }}
        >
          Detayları gör →
        </a>
      </article>
    );
  }

  return (
    <>
      <header>
        <h1>{title}</h1>
        {page === "home" && (
          <p>
            Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.
          </p>
        )}
      </header>

      <nav aria-label="Ana menü">
        {menu.map(oge => (
          <a
            key={oge.page}
            href={`#${oge.page}`}
            aria-current={page === oge.page ? "page" : undefined}
            onClick={olay => {
              olay.preventDefault();
              go(oge.page);
            }}
          >
            {oge.label}
          </a>
        ))}
      </nav>

      <main>
        {page === "home" && (
          <>
            <h2>Yaklaşan Etkinlikler</h2>
            <section
              className="etkinlik-kartlari"
              aria-label="Yaklaşan etkinlikler"
            >
              {upcoming.map(renderCard)}
            </section>
            <p>
              <a
                href="#events"
                onClick={olay => {
                  olay.preventDefault();
                  go("events");
                }}
              >
                Tüm etkinlikleri gör →
              </a>
            </p>
          </>
        )}

        {page === "events" && (
          <>
            <h2>Tüm Etkinlikler</h2>
            <form
              className="filtre"
              onSubmit={olay => olay.preventDefault()}
            >
              <div>
                <label htmlFor="arama">Etkinlik ara:</label>
                <input
                  type="search"
                  id="arama"
                  placeholder="Etkinlik adı veya açıklama"
                  value={searchText}
                  onChange={olay => setSearchText(olay.target.value)}
                />
              </div>
              <div>
                <label htmlFor="kategori-filtre">Kategori:</label>
                <select
                  id="kategori-filtre"
                  value={category}
                  onChange={olay =>
                    setCategory(olay.target.value as Category | "")
                  }
                >
                  <option value="">Tümü</option>
                  {categories.map(kategori => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <p aria-live="polite">
              {filtered.length === 0
                ? "Aramanıza uygun etkinlik bulunamadı."
                : `${filtered.length} etkinlik bulundu.`}
            </p>

            <section
              className="etkinlik-kartlari tum-etkinlikler"
              aria-label="Etkinlik listesi"
            >
              {filtered.map(renderCard)}
            </section>
          </>
        )}

        {page === "detail" && (
          <>
            {!selected && (
              <div className="detay-hata" role="alert">
                <p>Etkinlik bulunamadı.</p>
                <a
                  href="#events"
                  onClick={olay => {
                    olay.preventDefault();
                    go("events");
                  }}
                >
                  Listeye dön
                </a>
              </div>
            )}

            {selected && (
              <article
                className={
                  selected.image
                    ? "etkinlik-detayi"
                    : "etkinlik-detayi afissiz"
                }
              >
                {selected.image && (
                  <figure>
                    <img
                      src={selected.image}
                      alt={`${selected.title} afişi`}
                      width={480}
                      height={270}
                    />
                    <figcaption>{selected.title}</figcaption>
                  </figure>
                )}

                <div className="detay-bilgileri">
                  <div className="kunye-kutusu">
                    <h2>Etkinlik Künyesi</h2>
                    <dl>
                      <dt>Tarih</dt>
                      <dd>
                        <time dateTime={`${selected.date}T${selected.time}`}>
                          {formatDate(selected.date)}, {selected.time}
                        </time>
                      </dd>
                      <dt>Yer</dt>
                      <dd>{selected.location}</dd>
                      <dt>Kategori</dt>
                      <dd>{selected.category}</dd>
                      <dt>Kontenjan</dt>
                      <dd>{selected.capacity} kişi</dd>
                    </dl>
                  </div>

                  <h2>Açıklama</h2>
                  <p>{selected.description}</p>

                  <p>
                    <a
                      href="#update"
                      onClick={olay => {
                        olay.preventDefault();
                        go("update", selected.id);
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
                        go("events");
                      }}
                    >
                      Listeye dön
                    </a>
                  </p>
                </div>
              </article>
            )}
          </>
        )}

        {(page === "add" || page === "update") && (
  <>
    <p>
      Bu sprintte form yalnızca görünüm içindir.
      Bilgiler kaydedilmez veya güncellenmez.
    </p>

    <form
      className="etkinlik-formu"
      key={page}
      noValidate
      onSubmit={olay => olay.preventDefault()}
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
        <select id="kategori" name="kategori" defaultValue="" required>
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
        <button type="submit">
          {page === "add" ? "Kaydet" : "Güncelle"}
        </button>
        <button type="reset">Temizle</button>
      </p>
    </form>
  </>
)}
      </main>

      <footer>
        <p>AliEfe Demirci &middot; 2416501079 &middot; 2026</p>
      </footer>
    </>
  );
}

export default App;