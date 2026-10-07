import { events } from "./data.js";

const liste = document.querySelector("#etkinlik-listesi");

function createCard(etkinlik) {
  const [gun, ay, yil] = etkinlik.date.split("-");
  const isoTarih = `${yil}-${ay}-${gun}`;

  const okunurTarih = new Date(
    Number(yil),
    Number(ay) - 1,
    Number(gun)
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `
    <article class="etkinlik-karti">
      <h3>${etkinlik.title}</h3>
      <p>Kategori: ${etkinlik.category}</p>
      <p>Tarih:
        <time datetime="${isoTarih}T${etkinlik.time}">
          ${okunurTarih}, ${etkinlik.time}
        </time>
      </p>
      <p>Yer: ${etkinlik.location}</p>
      <p>${etkinlik.description}</p>
      <a href="etkinlik-detay.html?id=${etkinlik.id}">
        Detayları gör →
      </a>
    </article>
  `;
}

function render(etkinlikler) {
  liste.innerHTML = etkinlikler.map(createCard).join("");
}

if (liste) {
  const limit = Number(liste.dataset.limit);

  if (limit > 0) {
    const siraliEtkinlikler = [...events].sort((a, b) => {
      const [gunA, ayA, yilA] = a.date.split("-");
      const [gunB, ayB, yilB] = b.date.split("-");

      const tarihA = `${yilA}-${ayA}-${gunA}T${a.time}`;
      const tarihB = `${yilB}-${ayB}-${gunB}T${b.time}`;

      return tarihA.localeCompare(tarihB);
    });

    render(siraliEtkinlikler.slice(0, limit));
  } else {
    render(events);
  }
}

const filtreFormu = document.querySelector("#filtre-formu");

if (filtreFormu && liste) {
  const arama = document.querySelector("#arama");
  const kategoriFiltre = document.querySelector("#kategori-filtre");
  const sonuc = document.querySelector("#sonuc");

  const kategoriler = [...new Set(events.map(etkinlik => etkinlik.category))];

  kategoriler.forEach(kategori => {
    const secenek = document.createElement("option");
    secenek.value = kategori;
    secenek.textContent = kategori;
    kategoriFiltre.append(secenek);
  });

  function filtrele() {
    const aranan = arama.value.trim().toLocaleLowerCase("tr-TR");
    const secilenKategori = kategoriFiltre.value;

    const bulunanlar = events.filter(etkinlik => {
      const metin = [
        etkinlik.title,
        etkinlik.category,
        etkinlik.description
      ].join(" ").toLocaleLowerCase("tr-TR");

      const aramaUyuyor = metin.includes(aranan);
      const kategoriUyuyor =
        secilenKategori === "" ||
        etkinlik.category === secilenKategori;

      return aramaUyuyor && kategoriUyuyor;
    });

    render(bulunanlar);

    sonuc.textContent = bulunanlar.length > 0
      ? `${bulunanlar.length} etkinlik bulundu.`
      : "Aramanıza uygun etkinlik bulunamadı.";
  }

  arama.addEventListener("input", filtrele);
  kategoriFiltre.addEventListener("change", filtrele);

  filtreFormu.addEventListener("submit", olay => {
    olay.preventDefault();
  });

  filtrele();
}