# Kampüs Etkinlikleri API — Sprint 7

Öğrenci numarası: **2416501079**  
Backend: **Node.js + Express** — yalnızca bellek içi veri, henüz veritabanı yok.

## Kurulum ve çalıştırma

Node.js 20 veya üstünü kur. Komutları `backend/` içinde çalıştır:

```bash
npm install
cp .env.example .env
npm run dev
```

Windows'ta `.env.example` dosyasını `.env` adıyla kopyalayabilirsin.
Sunucu varsayılan olarak `http://localhost:3000` adresindedir. `npm start` normal başlatma komutudur.
Değişikliği izlemesi için `npm run dev` kullanılabilir. `PORT`, `.env` içinden `dotenv/config` ile okunur.

**Not:** `.env` ve `node_modules/` GitHub'a yüklenmez; `.env.example` yüklenir.
Postman için `requests/kampus-api.json` dosyasını `Import` ile aç. Collection'daki altı isteği sırayla çalıştır.
`npm test` bağımlılıklardan bağımsız kontrolcü birim testlerini çalıştırır.

## REST sözleşmesi

| Metot | Endpoint | Amaç | Başarı | Hata | Sprint |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | Sunucu durumu ve öğrenci numarası | 200 | — | 7 |
| GET | `/events` | 6 etkinliği listele, isteğe bağlı `category`, `q`, `minCapacity`, `mode` filtreleri | 200 | — | 7 |
| GET | `/events/:id` | ID ile tek etkinlik getir | 200 | 404 | 7 |
| POST | `/events` | Etkinlik oluştur | 201 | 400 | 7 |
| PATCH | `/events/:id` | Güncelle (henüz yapılmayacak) | 200 | 400, 404 | 9 |
| DELETE | `/events/:id` | Sil (henüz yapılmayacak) | 204 | 404 | 9 |

**İstenen durum kodları:** 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found.

Bütün hata yanıtları aynı yapıdadır:

```json
{ "error": { "message": "Event not found" } }
```

### Örnek GET yanıtı

`GET http://localhost:3000/health`:

```json
{ "status": "ok", "time": "2026-11-11T08:00:00.000Z", "student": "2416501079" }
```

`time` örnek değerdir, her istekte güncellenir. `GET /events` altı etkinlikli bir JSON dizisi döndürür.
`GET /events/event-2` tek etkinliği, `GET /events/yok` 404 döndürür.

### Filtreleme: kategori, arama, kontenjan ve etkinlik türü

Zorunlu API uç noktalarını değiştirmeden `GET /events` adresine isteğe bağlı bir `q` parametresi ekledim.
`http://localhost:3000/events?q=sensör` yalnızca başlığı, yeri veya açıklaması eşleşen etkinlikleri getirir.
`?category=Seminer&q=veri` parametreleri birlikte de kullanılabilir; arama büyük/küçük Türkçe harflere duyarsızdır.
`q` gönderilmezse **6 başlangıç etkinliğinin tamamı** döner. `GET /events/:id` aynı şekilde çalışır.
Ek olarak iki isteğe bağlı filtre vardır:

- `?minCapacity=50`: kapasitesi **en az 50** kişi olan etkinlikleri getirir (başlangıçta `event-1`, `event-4`, `event-5`).
- `?mode=online`: yalnızca **çevrim içi** etkinlikleri getirir (başlangıçta `event-5`).

Etkinlik türleri `mode` alanında `yuz-yuze` (yüz yüze), `online` (çevrim içi) ve `hibrit` olarak saklanır.
`event-4` hibrit, `event-5` çevrim içidir; diğer dört etkinlik yüz yüzedir.
Çevrim içi olan `event-5` için konum bilgisi çevrim içi yayına göre düzenlenmiştir.

Filtreler birleştirilebilir:

```text
GET /events?minCapacity=50&mode=hibrit      -> event-4
GET /events?category=Seminer&minCapacity=50 -> event-1, event-4
GET /events?q=sensör&mode=yuz-yuze          -> event-2
```

Hatalı `minCapacity` veya geçersiz `mode` değeri **400** döner. Hiçbiri verilmediğinde normal
`GET /events` **başlangıçta 6 etkinliği** getirir. Kategori ve arama filtreleri de eskisi gibi çalışır.
Zorunlu altı Postman isteği değiştirilmedi; bu filtreler ek seçeneklerdir.

### Örnek POST isteği

`POST http://localhost:3000/events` (`Content-Type: application/json`):

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "date": "2026-12-19",
  "capacity": 30,
  "mode": "online"
}
```

Başarılıysa **201** ve oluşturulan etkinlik döner. `id`, `event-` + zaman damgası olarak atanır.
`title`, `category`, `date` alanları zorunludur. Sadece `title` gönderilirse **400** döner:

```json
{ "error": { "message": "title, category and date are required" } }
```

`capacity` verilmezse `0`, `time`, `location`, `description` verilmezse boş metin olur.
`mode` verilmezse varsayılan `yuz-yuze` olur. Verilirse `yuz-yuze`, `online` veya `hibrit` olmalıdır;
diğer değerlerde **400** yanıtı döner. Böylece eski POST örnekleri aynen çalışmaya devam eder.

## Altı Postman kontrolü

1. `GET /health` -> 200, `status=ok`, `student=2416501079`.
2. `GET /events` -> 200, başlangıçta 6 etkinlik.
3. `GET /events/event-2` -> 200, `event-2`.
4. `GET /events/yok` -> 404, `error`.
5. `POST /events` (tam body) -> 201, yeni `id`.
6. `POST /events` (sadece title) -> 400, `error`.

Postman'a collection import edildikten sonra `Collection Runner` ile testler toplu çalıştırılabilir.

## Kısıtlar

Veriler **RAM'de** durur, POST ile eklenenler sunucu kapanınca silinir. MongoDB Sprint 8'de, güncelle/sil Sprint 9'da, yetkilendirme Sprint 10'da ve frontend bağlantısı Sprint 11'de yapılacak. Frontend bu sprintte değiştirilmez; Vercel ayarı aynı kalır.
