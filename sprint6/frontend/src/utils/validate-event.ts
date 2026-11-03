import type { Category } from "../types/campus-event";

export const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

export interface EventFormData {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  description: string;
}

export type EventFormErrors = Partial<Record<keyof EventFormData, string>>;

export function validateEvent(data: EventFormData): EventFormErrors {
  const errors: EventFormErrors = {};
  if (data.title.trim().length < 3) errors.title = "En az 3 karakter girin.";
  if (!categories.some(category => category === data.category)) errors.category = "Bir kategori seçin.";
  if (!data.date) errors.date = "Tarih girin.";
  if (!data.time) errors.time = "Saat girin.";
  if (!data.location.trim()) errors.location = "Yer girin.";
  const capacity = Number(data.capacity);
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
    errors.capacity = "1 ile 1000 arası bir tam sayı girin.";
  }
  if (data.description.trim().length < 10) errors.description = "En az 10 karakter girin.";
  return errors;
}
