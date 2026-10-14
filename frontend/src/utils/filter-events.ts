import type {
  CampusEvent,
  Category
} from "../types/campus-event";

export function searchEvents(
  list: CampusEvent[],
  text: string
): CampusEvent[] {
  const aranan = text.trim().toLocaleLowerCase("tr-TR");

  return list.filter(etkinlik => {
    const baslik = etkinlik.title.toLocaleLowerCase("tr-TR");
    const aciklama = etkinlik.description.toLocaleLowerCase("tr-TR");

    return baslik.includes(aranan) || aciklama.includes(aranan);
  });
}

export function filterByCategory(
  list: CampusEvent[],
  category: Category | ""
): CampusEvent[] {
  if (category === "") {
    return list;
  }

  return list.filter(etkinlik => etkinlik.category === category);
}

export function findEventById(
  list: CampusEvent[],
  id: string
): CampusEvent | undefined {
  return list.find(etkinlik => etkinlik.id === id);
}