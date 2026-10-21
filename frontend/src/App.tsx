import { useEffect, useState } from "react";
import "./App.css";
import { events } from "./data/events";
import type { Category } from "./types/campus-event";
import type { PageName } from "./types/page";
import {
  searchEvents,
  filterByCategory,
  findEventById
} from "./utils/filter-events";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail";
import EventForm from "./components/forms/EventForm";

const basliklar: Record<PageName, string> = {
  home: "Kampüs Etkinlikleri",
  events: "Etkinlik Listesi",
  detail: "Etkinlik Detayı",
  add: "Etkinlik Ekle",
  update: "Etkinlik Güncelle"
};

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const categories = [...new Set(events.map(event => event.category))];
  const filtered = filterByCategory(searchEvents(events, searchText), category);
  const selected = selectedId ? findEventById(events, selectedId) : undefined;
  const title = page === "detail"
    ? selected?.title ?? "Etkinlik bulunamadı"
    : basliklar[page];
  const upcoming = [...events]
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    )
    .slice(0, 2);

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  return (
    <>
      <Header
        title={title}
        text={page === "home"
          ? "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin."
          : undefined}
      />
      <Navigation current={page} onNavigate={go} />
      <main>
        {page === "home" && (
          <>
            <h2>Yaklaşan Etkinlikler</h2>
            <section className="etkinlik-kartlari" aria-label="Yaklaşan etkinlikler">
              <EventList events={upcoming} onShowDetail={id => go("detail", id)} />
            </section>
            <p>
              <a href="#events" onClick={olay => {
                olay.preventDefault();
                go("events");
              }}>
                Tüm etkinlikleri gör →
              </a>
            </p>
          </>
        )}
        {page === "events" && (
          <>
            <h2>Tüm Etkinlikler</h2>
            <EventFilter
              searchText={searchText}
              category={category}
              categories={categories}
              onSearchChange={setSearchText}
              onCategoryChange={setCategory}
            />
            <p aria-live="polite">
              {filtered.length > 0 && `${filtered.length} etkinlik bulundu.`}
            </p>
            <section className="etkinlik-kartlari tum-etkinlikler" aria-label="Etkinlik listesi">
              <EventList
                events={filtered}
                onShowDetail={id => go("detail", id)}
                emptyText="Aramanıza uygun etkinlik bulunamadı."
              />
            </section>
          </>
        )}
        {page === "detail" && (
          selected ? (
            <EventDetail
              event={selected}
              onBack={() => go("events")}
              onEdit={id => go("update", id)}
            />
          ) : (
            <div className="detay-hata" role="alert">
              <p>Etkinlik bulunamadı.</p>
              <a href="#events" onClick={olay => {
                olay.preventDefault();
                go("events");
              }}>
                Listeye dön
              </a>
            </div>
          )
        )}
        {(page === "add" || page === "update") && (
          <EventForm
            key={page}
            submitLabel={page === "add" ? "Kaydet" : "Güncelle"}
            onSubmit={() => window.scrollTo(0, 0)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;