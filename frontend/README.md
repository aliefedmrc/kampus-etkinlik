# Kampüs Etkinlikleri — Sprint 5

AliEfe Demirci — 2416501079

## Canlı site

https://kampus-etkinlik-sprint2-rho.vercel.app

## Proje

Vite, React ve TypeScript ile hazırlanan Kampüs Etkinlikleri
uygulaması, Sprint 5'te yeniden kullanılabilir bileşenlere ayrıldı.
Sprint 4'ün mevcut frontend klasöründe devam edildi.

Ana sayfa, etkinlik listesi, detay, ekle ve güncelle ekranları bulunur.
Mevcut tasarım ve sayfa davranışları korunmuştur.

## Bileşenler

- Header: Başlığı ve isteğe bağlı açıklamayı props ile alır.
- Navigation: Aktif sayfayı gösterir, geçişleri callback ile bildirir.
- Footer: Öğrenci bilgilerini gösterir.
- EventCard: Tek etkinliği gösterir, detay isteğini callback ile bildirir.
- EventList: Etkinlikleri ID anahtarlarıyla listeler; boş sonuç mesajı gösterir.
- EventFilter: Arama ve kategori değerlerini props ile alır,
  değişiklikleri callback ile bildirir.
- EventDetail: Etkinlik detayını gösterir; geri dönüş ve güncelleme
  isteklerini callback ile bildirir.
- EventForm: Ekle ve güncelle ekranlarında ortak kullanılır.
  Gönderimde sayfa yenilenmez, onSubmit callback'i çağrılır.

Props tipleri interface ile tanımlanmıştır.
Sayfa, seçili etkinlik ID'si, arama ve kategori state'leri App.tsx'te tutulur.
Tarayıcı başlığı useEffect ile güncellenir.
React Router kullanılmamıştır.

Formlar yalnızca görünüm içindir; kayıt, doğrulama veya otomatik
doldurma yapılmaz. Gerçek kayıt işlemleri Sprint 6'ya bırakılmıştır.

## Dosya yapısı

- src/components/layout/: Header, Navigation, Footer
- src/components/events/: EventCard, EventList, EventFilter, EventDetail
- src/components/forms/: EventForm
- src/types/page.ts: Sayfa adlarının tipi
- src/types/campus-event.ts: Etkinlik ve kategori tipleri
- src/utils/format-date.ts: Türkçe tarih biçimlendirme
- src/utils/filter-events.ts: Arama, kategori filtresi ve ID ile bulma
- src/data/events.ts: Altı etkinliğin verileri
- src/App.tsx: State, sayfa yönetimi ve bileşenlerin birleştirilmesi
- src/App.css: Site tasarımı
- src/main.tsx: React giriş noktası
- public/: Afiş ve diğer statik dosyalar

## Çalıştırma

Komutlar frontend klasöründe çalıştırılır:

```bash
npm install
npm run dev
```

## Derleme ve önizleme

```bash
npm run build
npm run preview
```

## Yayınlama

Vercel Root Directory: frontend
Framework Preset: Vite

GitHub'a gönderilen değişiklikler bağlı Vercel projesinde
otomatik yayınlanır.

Sprint etiketi: sprint-05