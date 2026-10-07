import { events } from "./data.js";

const detay = document.querySelector("#detay");
const baslik = document.querySelector("header h1");

const parametreler = new URLSearchParams(window.location.search);
const id = parametreler.get("id");
const etkinlik = events.find(etkinlik => etkinlik.id === id);

if (detay) {
  if (!etkinlik) {
    if (baslik) {
      baslik.textContent = "Etkinlik bulunamadı";
    }

    document.title = "Kampüs Etkinlikleri — Etkinlik bulunamadı";

    detay.innerHTML = `
      <p class="detay-hata" role="alert">
        Etkinlik seçilmedi veya bu kimliğe ait etkinlik bulunamadı.
      </p>
      <a href="etkinlikler.html">Etkinlik listesine dön</a>
    `;
  } else {
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

    if (baslik) {
      baslik.textContent = etkinlik.title;
    }

    document.title = `Kampüs Etkinlikleri — ${etkinlik.title}`;

    const afis = etkinlik.id === "event-1"
      ? `<img
           src="afis.svg"
           alt="Kariyer Günleri 2026 afişi"
           width="480"
           height="270">`
      : `<svg
           viewBox="0 0 480 270"
           width="480"
           role="img"
           aria-label="Kampüs etkinlikleri genel afişi"
           style="display:block; max-width:100%; height:auto">
           <rect width="480" height="270" rx="8"
                 fill="var(--renk-ana)"/>
           <text x="240" y="125" text-anchor="middle"
                 fill="white" font-size="28" font-family="sans-serif">
             KAMPÜS ETKİNLİKLERİ
           </text>
           <text x="240" y="170" text-anchor="middle"
                 fill="white" font-size="20" font-family="sans-serif">
             2026
           </text>
         </svg>`;

    detay.innerHTML = `
      <article class="etkinlik-detayi">
        <figure>
          ${afis}
          <figcaption>${etkinlik.title}</figcaption>
        </figure>

        <div class="detay-bilgileri">
        <div class="kunye-kutusu">  
        <h2>Etkinlik Künyesi</h2>

          <dl>
            <dt>Tarih</dt>
            <dd>
              <time datetime="${isoTarih}T${etkinlik.time}">
                ${okunurTarih}, ${etkinlik.time}
              </time>
            </dd>

            <dt>Yer</dt>
            <dd>${etkinlik.location}</dd>

            <dt>Kategori</dt>
            <dd>${etkinlik.category}</dd>

            <dt>Kontenjan</dt>
            <dd>${etkinlik.capacity} kişi</dd>
          </dl>

          </div>

          <h2>Açıklama</h2>
          <p>${etkinlik.description}</p>

          <p>
            <a href="etkinlik-guncelle.html?id=${etkinlik.id}">
              Bu etkinliği güncelle
            </a>
          </p>

          <p>
            <a href="etkinlikler.html">Listeye dön</a>
          </p>
        </div>
      </article>
    `;
  }
}