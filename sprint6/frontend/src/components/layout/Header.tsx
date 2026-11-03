import { useEffect } from "react";

import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/events": "Tüm Etkinlikler",
  "/admin": "Yönetim",
  "/login": "Giriş Yap",
};

export default function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Kampüs Etkinlikleri";
  useEffect(() => {
  const pageTitle = pathname === "/admin" ? "Etkinlik Yönetimi" : title;

  document.title =
    pageTitle === "Kampüs Etkinlikleri"
      ? pageTitle
      : `${pageTitle} — Kampüs Etkinlikleri`;
}, [pathname, title]);

  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}