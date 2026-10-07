import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesaj = document.querySelector("#form-mesaj");

if (form && mesaj) {
  const guncelleme = form.dataset.mode === "guncelle";
  let mevcutEtkinlik = null;

  function mesajGoster(yazi, tur) {
    mesaj.className = tur;
    mesaj.textContent = yazi;
  }

  function hatalariTemizle() {
    form.querySelectorAll(".alan-hata").forEach(alan => {
      alan.textContent = "";
    });

    form.querySelectorAll("[aria-invalid]").forEach(alan => {
      alan.removeAttribute("aria-invalid");
    });
  }

  if (guncelleme) {
    const id = new URLSearchParams(window.location.search).get("id");
    mevcutEtkinlik = events.find(etkinlik => etkinlik.id === id);

    if (!mevcutEtkinlik) {
      form.hidden = true;
      mesajGoster("Güncellenecek etkinlik bulunamadı. ", "form-hata");

      const baglanti = document.createElement("a");
      baglanti.href = "etkinlikler.html";
      baglanti.textContent = "Etkinlik listesine dön";
      mesaj.append(baglanti);
    } else {
      const [gun, ay, yil] = mevcutEtkinlik.date.split("-");

      const degerler = {
        ad: mevcutEtkinlik.title,
        kategori: mevcutEtkinlik.category,
        tarih: `${yil}-${ay}-${gun}`,
        saat: mevcutEtkinlik.time,
        yer: mevcutEtkinlik.location,
        kontenjan: mevcutEtkinlik.capacity,
        aciklama: mevcutEtkinlik.description
      };

      Object.entries(degerler).forEach(([ad, deger]) => {
        const alan = form.elements.namedItem(ad);
        alan.value = deger;

        if (alan.tagName === "SELECT") {
          Array.from(alan.options).forEach(secenek => {
            secenek.defaultSelected = secenek.value === String(deger);
          });
        } else {
          alan.defaultValue = deger;
        }
      });
    }
  }

  form.addEventListener("submit", olay => {
    olay.preventDefault();
    hatalariTemizle();
    mesaj.replaceChildren();
    mesaj.className = "";

    const formVerisi = new FormData(form);
    const oku = ad => String(formVerisi.get(ad) ?? "").trim();

    const ad = oku("ad");
    const kategori = oku("kategori");
    const tarih = oku("tarih");
    const saat = oku("saat");
    const yer = oku("yer");
    const kontenjan = oku("kontenjan");
    const aciklama = oku("aciklama");

    const hatalar = {};

    if (ad.length < 3) {
      hatalar.ad = "Etkinlik adı en az 3 karakter olmalıdır.";
    }

    if (!kategori) {
      hatalar.kategori = "Bir kategori seçiniz.";
    }

    if (!tarih) {
      hatalar.tarih = "Tarih seçiniz.";
    }

    if (!saat) {
      hatalar.saat = "Saat seçiniz.";
    }

    if (!yer) {
      hatalar.yer = "Etkinlik yerini yazınız.";
    }

    const kontenjanAlani = form.elements.namedItem("kontenjan");

    if (
      kontenjanAlani.validity.badInput ||
      (kontenjan !== "" && (
        !Number.isInteger(Number(kontenjan)) ||
        Number(kontenjan) < 1 ||
        Number(kontenjan) > 1000
      ))
    ) {
      hatalar.kontenjan = "Kontenjan 1–1000 arasında bir tam sayı olmalıdır.";
    }

    if (Object.keys(hatalar).length > 0) {
      Object.entries(hatalar).forEach(([ad, hata]) => {
        const alan = form.elements.namedItem(ad);
        alan.setAttribute("aria-invalid", "true");
        document.getElementById(`${ad}-hata`).textContent = hata;
      });

      mesajGoster("Formda hatalı alanlar var.", "form-hata");
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const [yil, ay, gun] = tarih.split("-");

    const veri = {
      title: ad,
      category: kategori,
      date: `${gun}-${ay}-${yil}`,
      time: saat,
      location: yer,
      description: aciklama,
      capacity: kontenjan === "" ? null : Number(kontenjan)
    };

    if (guncelleme && mevcutEtkinlik) {
      veri.id = mevcutEtkinlik.id;
    }

    console.log(veri);

    mesajGoster(
      guncelleme
        ? "Güncelleme bilgileri doğrulandı. Kalıcı kayıt yapılmadı."
        : "Etkinlik bilgileri doğrulandı. Kalıcı kayıt yapılmadı.",
      "form-basari"
    );

    const json = document.createElement("pre");
    json.textContent = JSON.stringify(veri, null, 2);
    mesaj.append(json);
  });

  form.addEventListener("reset", () => {
    hatalariTemizle();
    mesaj.replaceChildren();
    mesaj.className = "";
  });
}