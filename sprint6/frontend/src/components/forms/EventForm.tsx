import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type { EventValues } from "../../context/useEvents";
import { categories, validateEvent } from "../../utils/validate-event";
import type { EventFormData, EventFormErrors } from "../../utils/validate-event";

const empty: EventFormData = {
  title: "", category: "", date: "", time: "", location: "", capacity: "", description: "",
};

const fields = [
  { name: "title", label: "Etkinlik Adı", type: "text", maxLength: 80 },
  { name: "category", label: "Kategori", type: "select" },
  { name: "date", label: "Tarih", type: "date" },
  { name: "time", label: "Saat", type: "time" },
  { name: "location", label: "Yer", type: "text", maxLength: 80 },
  { name: "capacity", label: "Kontenjan", type: "number" },
  { name: "description", label: "Açıklama", type: "textarea" },
] as const;

export default function EventForm({ initial, onSave }: {
  initial?: EventValues;
  onSave: (data: EventValues) => void;
}) {
  const initialData = initial ? { ...initial, capacity: String(initial.capacity) } : empty;
  const [data, setData] = useState<EventFormData>(initialData);
  const [errors, setErrors] = useState<EventFormErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateEvent(data);
    setErrors(nextErrors);
    const category = categories.find(option => option === data.category);
    if (Object.keys(nextErrors).length || !category) return;

    onSave({
      ...data,
      title: data.title.trim(),
      location: data.location.trim(),
      description: data.description.trim(),
      category,
      capacity: Number(data.capacity),
    });
  }

  return (
    <form className="etkinlik-formu" noValidate onSubmit={submit} onReset={() => {
      setData(initialData);
      setErrors({});
    }}>
      {fields.map(field => {
        const { name, label, type } = field;
        const error = errors[name];
        const props = {
          id: name,
          name,
          required: true,
          value: data[name],
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? `${name}-error` : undefined,
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setData(current => ({ ...current, [name]: event.target.value })),
        };

        return (
          <div className="form-alani" key={name}>
            <label htmlFor={name}>{label} *</label>
            {type === "select" ? (
              <select {...props}>
                <option value="">Seçiniz</option>
                {categories.map(category => <option key={category}>{category}</option>)}
              </select>
            ) : type === "textarea" ? (
              <textarea {...props} rows={5} />
            ) : (
              <input {...props} type={type} maxLength={"maxLength" in field ? field.maxLength : undefined} />
            )}
            {error && <small id={`${name}-error`} className="alan-hata" role="alert">{error}</small>}
          </div>
        );
      })}
      <div className="islemler">
        <button type="submit">{initial ? "Güncelle" : "Kaydet"}</button>
        <button type="reset">{initial ? "Sıfırla" : "Temizle"}</button>
        <Link to="/admin">İptal</Link>
      </div>
    </form>
  );
}
