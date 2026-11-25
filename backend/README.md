# Kampüs Etkinlikleri API — Sprint 9

Öğrenci numarası **2416501079**

Express API, etkinlik kayıtlarını Mongoose üzerinden MongoDB'nin `events` koleksiyonunda saklar.

## Kurulum

`backend/` klasöründe `npm install` çalıştır. `.env.example` dosyasını örnek alarak kendi `.env` dosyanda `PORT` ve `MONGODB_URI` değerlerini ayarla. Atlas bağlantı adresini yalnızca yerel `.env` dosyana yaz. Veritabanı adı `kampus`.

```bash
npm run seed
npm run dev
```

`npm run seed` mevcut etkinlikleri silip altı örnek kayıt ekler. İki kaydın tarihi geçmiştir. Örnek verileri sıfırlamak istediğinde çalıştır. Sunucu varsayılan olarak `http://localhost:3000` adresinde açılır. `npm test` kontrolcü, şema ve tarih testlerini çalıştırır.

## API

| Metot | Adres | Yanıt | Durum |
| --- | --- | --- | --- |
| GET | `/health` | 200 ve öğrenci numarası | çalışıyor |
| GET | `/events` | 200 ve tarihe göre sıralanmış liste | çalışıyor |
| GET | `/events?search=atölye&category=Atölye` | 200 ve filtrelenmiş liste | çalışıyor |
| GET | `/events/upcoming` | 200; bugün ve sonrası, tarih ve saate göre artan sıra | çalışıyor |
| GET | `/events/:id` | 200 ve etkinlik; bulunamazsa 404 | çalışıyor |
| POST | `/events` | 201 ve yeni etkinlik; doğrulama hatasında 400 | çalışıyor |
| PATCH | `/events/:id` | 200 ve güncel kayıt; geçersiz veride 400, bulunamazsa 404 | çalışıyor |
| DELETE | `/events/:id` | 204, gövde yok; bulunamazsa 404 | çalışıyor |

`search` başlıkta büyük/küçük harf ayrımı yapmadan arar. Özel regex karakterleri düz metin olarak aranır. `category` ile birlikte kullanılabilir. Önceki `q`, `minCapacity` ve `mode` filtreleri de kullanılabilir. `q` başlık, yer ve açıklamada arar. Katılım türleri `yuz-yuze`, `online` ve `hibrit`. Örnek birleşik filtre `/events?minCapacity=50&mode=hibrit`.

Yeni kayıt için `title`, `category` ve `date` gerekir. Kategoriler `Seminer`, `Atölye`, `Söyleşi` ve `Yarışma`. MongoDB kayıt kimliğini `_id` alanında döndürür.

Tarih isteklerde ve yanıtlarda `GG-AA-YYYY` biçimindedir: `20-12-2026`. MongoDB'de gerçek `Date` olarak saklanır. ISO tarih metni ve `31-02-2026` gibi geçersiz günler 400 döndürür. Gün sınırı UTC üzerinden hesaplanır. Sunucu açılırken Sprint 8'den kalan `YYYY-MM-DD` tarih metinleri Date türüne dönüştürülür.

PATCH yalnızca gönderilen alanları değiştirir. Boş gövde, bilinmeyen alanlar ve `_id`, `createdAt`, `updatedAt`, `__v` değişiklikleri 400 döndürür. Doğrulama kuralları güncellemede de geçerlidir. GET, PATCH ve DELETE için geçersiz veya bulunamayan kimlik 404 döndürür. Hata biçimi `{ "error": { "message": "…" } }`.

## Test

`requests/kampus-api.json`, [dersin test koleksiyonunun](https://webdersi.vercel.app/test.json) değiştirilmemiş kopyasıdır. Sunucu açıkken:

```bash
newman run https://webdersi.vercel.app/test.json
```

Beklenen sonuç 18 istek, 45 test ve 0 hatadır. Koleksiyon deneme kaydını kendisi oluşturur, günceller ve siler; kimlikleri otomatik kaydeder. Tekrar çalıştırılabilir.

`requests/run-results.json`, yerel MongoDB üzerinde Newman ile alınan JSON test raporudur. Kendi bilgisayarındaki Postman Runner sonucunu kaydetmek için koleksiyonu içe aktar, **Run collection** ile çalıştır ve **Export Results** ile bu dosyanın yerine kaydet.

Kalıcılık kontrolü için bir etkinlik oluştur, `_id` değerini kaydet, sunucuyu durdurup yeniden başlat ve `/events/<id>` adresini tekrar aç. Bu kontrol sırasında seed çalıştırma; seed mevcut kayıtları sıfırlar.
