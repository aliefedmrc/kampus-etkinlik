import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="detay-hata">
      <h2>Sayfa bulunamadı</h2>
      <p>Aradığınız sayfa veya etkinlik mevcut değil.</p>
      <Link to="/">Ana sayfaya dön</Link>
    </section>
  );
}
