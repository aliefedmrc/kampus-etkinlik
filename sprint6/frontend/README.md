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
**Canlı site:** [aliefedemirci-frontend.vercel.app](https://aliefedemirci-frontend.vercel.app/)