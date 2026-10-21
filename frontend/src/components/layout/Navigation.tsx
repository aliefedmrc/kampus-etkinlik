import type { PageName } from "../../types/page";

interface NavigationProps {
  current: PageName;
  onNavigate: (page: PageName) => void;
}

const menu: { page: PageName; label: string }[] = [
  { page: "home", label: "Ana Sayfa" },
  { page: "events", label: "Etkinlikler" },
  { page: "add", label: "Etkinlik Ekle" }
];

function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <nav aria-label="Ana menü">
      {menu.map(oge => (
        <a
          key={oge.page}
          href={`#${oge.page}`}
          aria-current={current === oge.page ? "page" : undefined}
          onClick={olay => {
            olay.preventDefault();
            onNavigate(oge.page);
          }}
        >
          {oge.label}
        </a>
      ))}
    </nav>
  );
}

export default Navigation;