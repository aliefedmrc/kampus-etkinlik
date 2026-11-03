import type { Category } from "../../types/campus-event";

export default function EventFilter({ searchText, category, categories, setSearchText, setCategory }: {
  searchText: string;
  category: Category | "";
  categories: Category[];
  setSearchText: (value: string) => void;
  setCategory: (value: Category | "") => void;
}) {
  return (
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
  );
}
