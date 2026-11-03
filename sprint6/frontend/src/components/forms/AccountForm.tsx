import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type Field = "name" | "email" | "password" | "repeat";
type Values = Record<Field, string>;

const empty: Values = { name: "", email: "", password: "", repeat: "" };
const labels: Record<Field, string> = {
  name: "Ad Soyad", email: "E-posta", password: "Şifre", repeat: "Şifre Tekrar",
};

export default function AccountForm({ mode, children }: {
  mode: "login" | "register" | "forgot";
  children: ReactNode;
}) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [sent, setSent] = useState(false);
  const fields: Field[] = mode === "register" ? ["name", "email", "password", "repeat"]
    : mode === "login" ? ["email", "password"] : ["email"];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Values> = {};
    if (!values.email.trim().includes("@")) next.email = "Geçerli bir e-posta adresi girin.";
    if (mode !== "forgot" && values.password.length < 6) next.password = "En az 6 karakter girin.";
    if (mode === "register") {
      if (values.name.trim().length < 3) next.name = "En az 3 karakter girin.";
      if (!values.repeat || values.password !== values.repeat) next.repeat = "Şifreler aynı olmalı.";
    }
    setErrors(next);
    setSent(Object.keys(next).length === 0);
  }

  const buttons = { login: "Giriş Yap", register: "Kayıt Ol", forgot: "Bağlantı Gönder" };
  const messages = {
    login: "Giriş başarılı (demo).",
    register: "Kayıt başarılı (demo).",
    forgot: "Şifre sıfırlama isteği alındı (demo).",
  };

  return (
    <>
      <form className="etkinlik-formu" noValidate onSubmit={submit}>
        {fields.map(field => (
          <div className="form-alani" key={field}>
            <label htmlFor={field}>{labels[field]} *</label>
            <input
              id={field}
              name={field}
              required
              type={field === "name" ? "text" : field === "email" ? "email" : "password"}
              value={values[field]}
              onChange={event => {
                setValues(current => ({ ...current, [field]: event.target.value }));
                setSent(false);
              }}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
            />
            {errors[field] && (
              <small id={`${field}-error`} className="alan-hata" role="alert">{errors[field]}</small>
            )}
          </div>
        ))}
        <button type="submit">{buttons[mode]}</button>
        {sent && <p role="status">{messages[mode]}</p>}
      </form>
      {children}
    </>
  );
}
