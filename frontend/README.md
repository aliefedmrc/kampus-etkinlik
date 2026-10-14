https://kampus-etkinlik-sprint2-rho.vercel.app

# Kampüs Etkinlikleri — Sprint 4

AliEfe Demirci — 2416501079

## Proje

Kampüs Etkinlikleri sitesi Vite, React ve TypeScript ile oluşturuldu.
Sprint 3 klasörü korunarak yeni uygulama frontend klasöründe hazırlandı.

Ana sayfa, etkinlik listesi, detay, ekle ve güncelle ekranları App.tsx içinde bulunur.
Sayfa geçişleri ve arama/kategori seçimleri useState ile yönetilir.
Tarayıcı sekmesinin başlığı useEffect ile güncellenir.
Formlar yalnızca görünüm içindir; kayıt, doğrulama veya otomatik doldurma yapılmaz.
React Router kullanılmadı.

## Dosyalar ve görevleri

- package.json: Paketleri ve dev, build, preview komutlarını tanımlar.
- package-lock.json: Yüklenen paketlerin tam sürümlerini tutar.
- node_modules/: İndirilen paketleri içerir; GitHub'a gönderilmez.
- tsconfig*.json: TypeScript derleme ve tip kontrolü ayarlarını içerir.
- vite.config.ts: Vite ve React eklentisinin ayarlarını tanımlar.
- index.html: React'in yerleşeceği root alanını içeren HTML girişidir.
- src/main.tsx: React'i başlatır ve App bileşenini root alanına yerleştirir.
- src/App.tsx: Beş ekranı, menüyü ve uygulamanın etkileşimlerini içerir.
- src/App.css: Sprint 3'ten taşınan site tasarımını içerir.
- src/index.css: Örnek tema kaldırıldığı için boş bırakılmıştır.
- public/: Afiş gibi doğrudan sunulan dosyaları içerir.
- src/types/campus-event.ts: Etkinlik ve kategori tiplerini tanımlar.
- src/data/events.ts: Altı etkinliğin tipli verilerini tutar.
- src/utils/filter-events.ts: Arama, kategori filtresi ve ID ile bulma fonksiyonlarını içerir.
- .gitignore: node_modules ve dist gibi üretilen klasörleri Git dışında tutar.

## Çalıştırma

Komutlar frontend klasöründe çalıştırılır:

npm install
npm run dev

## Derleme ve önizleme

npm run build
npm run preview