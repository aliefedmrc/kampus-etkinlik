import { useState } from "react";
import EventFilter from "../components/events/EventFilter";
import EventList from "../components/events/EventList";
import { useEvents } from "../context/useEvents";
import type { Category } from "../types/campus-event";
import { filterByCategory, searchEvents } from "../utils/filter-events";

export default function EventsPage() {
  const { events } = useEvents();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const categories = [...new Set(events.map(event => event.category))];
  const filtered = filterByCategory(searchEvents(events, searchText), category);

  return (
    <>
      <h2>Tüm Etkinlikler</h2>
      <EventFilter
        searchText={searchText}
        category={category}
        categories={categories}
        setSearchText={setSearchText}
        setCategory={setCategory}
      />
      <p aria-live="polite">
        {filtered.length ? `${filtered.length} etkinlik bulundu.` : "Aramanıza uygun etkinlik bulunamadı."}
      </p>
      <EventList events={filtered} label="Etkinlik listesi" all />
    </>
  );
}
