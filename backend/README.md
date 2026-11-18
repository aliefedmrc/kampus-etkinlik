# Kampüs Etkinlikleri API — Sprint 8

Öğrenci numarası **2416501079**

Express API, etkinlik kayıtlarını Mongoose üzerinden MongoDB'nin `events` koleksiyonunda saklar.

## Kurulum

`backend/` klasöründe `npm install` çalıştır. `.env.example` dosyasını örnek alarak kendi `.env` dosyanda `PORT` ve `MONGODB_URI` değerlerini ayarla. Atlas bağlantı adresini yalnızca yerel `.env` dosyana yaz. Veritabanı adı `kampus`.

```bash
npm run seed
npm run dev
```

`npm run seed` mevcut etkinlikleri silip altı örnek kayıt ekler. Örnek verileri sıfırlamak istediğinde çalıştır. Sunucu varsayılan olarak `http://localhost:3000` adresinde açılır. `npm test` kontrolcü ve şema testlerini çalıştırır.

## API

| Metot | Adres | Yanıt |
| --- | --- | --- |
| GET | `/health` | 200 ve öğrenci numarası |
| GET | `/events` | 200 ve tarihe göre sıralanmış liste |
| GET | `/events/:id` | 200 ve etkinlik. Kayıt yoksa veya kimlik geçersizse 404 |
| POST | `/events` | 201 ve yeni etkinlik. Doğrulama hatasında 400 |

Listeyi `category`, `q`, `minCapacity` ve `mode` parametreleriyle filtreleyebilirsin. `q` başlık, yer ve açıklamada arar. Katılım türleri `yuz-yuze`, `online` ve `hibrit`. Örnek birleşik filtre `/events?minCapacity=50&mode=hibrit`.

Yeni kayıt için `title`, `category` ve `date` gerekir. Kategoriler `Seminer`, `Atölye`, `Söyleşi` ve `Yarışma`. MongoDB kayıt kimliğini `_id` alanında döndürür.

## Postman ile kontrol

1. `requests/kampus-api.json` dosyasını içe aktar. Seed'den sonra altı isteği sırayla çalıştır. Liste isteği detay isteği için bir `_id` kaydeder.
2. Başarılı POST yanıtındaki `_id` değerini kopyala. Sunucuyu durdurup yeniden başlat.
3. `GET /events/<kopyalanan-id>` isteğinde 200 ve eklediğin etkinliği gör.
