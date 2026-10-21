import type { Category } from "../../types/campus-event";

interface EventFilterProps {
  searchText: string;
  category: Category | "";
  categories: Category[];
  onSearchChange: (text: string) => void;
  onCategoryChange: (category: Category | "") => void;
}

function EventFilter({
  searchText,
  category,
  categories,
  onSearchChange,
  onCategoryChange
}: EventFilterProps) {
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
          onChange={olay => onSearchChange(olay.target.value)}
        />
      </div>

      <div>
        <label htmlFor="kategori-filtre">Kategori:</label>
        <select
          id="kategori-filtre"
          value={category}
          onChange={olay =>
            onCategoryChange(olay.target.value as Category | "")
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

export default EventFilter;