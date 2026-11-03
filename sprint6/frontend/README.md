# Kampüs Etkinlikleri — Sprint 6

AliEfe Demirci · 2416501079

## Yerelde çalıştırma

`frontend` klasöründe aşağıdaki komutları çalıştırın.

```bash
npm install
npm run dev
```

Windows PowerShell yürütme ilkesi npm'i engellerse aynı komutlarda `npm.cmd` kullanın.

Üretim derlemesi için `npm run build`, kod kontrolü için `npm run lint`.

## Sayfalar

| Adres | Sayfa |
|---|---|
| `/` | Ana sayfa |
| `/events` | Etkinlik listesi ve filtreler |
| `/events/:id` | Etkinlik detayı |
| `/login` | Giriş |
| `/register` | Kayıt |
| `/forgot-password` | Şifremi unuttum |
| `/admin` | Etkinlik yönetimi |
| `/admin/new` | Etkinlik ekleme |
| `/admin/:id/edit` | Etkinlik düzenleme |
| `*` | Sayfa bulunamadı |

Etkinlik değişiklikleri aynı oturumda tüm sayfalara yansır. Tarayıcı yenilenince örnek etkinlikler geri gelir. Hesap formları demo olarak doğrulama ve sonuç mesajı gösterir. Yönetim sayfası doğrudan açılabilir.

## Vercel ve teslim

Vercel kök dizinini `frontend` olarak seçin. Hedef proje adı `aliefedemirci-frontend`. Yayından sonra doğrulanmış canlı adresi bu bölüme ekleyin. Kök dizininde arşivin içindeki `frontend` klasörü zaten açılmışsa Vercel kökü olarak mevcut dizini kullanın.

Yayın ve README güncellemesi sonrası, mevcut Git deposunun kökünde teslim commit'ini oluşturun.

```bash
git add .
git commit -m "Complete sprint 6 and midterm frontend"
git tag frontend
git push
git push origin frontend
```
