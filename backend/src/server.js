import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 3000;

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`API: http://localhost:${port}`);
  });
} catch (error) {
  console.error(process.env.MONGODB_URI
    ? `MongoDB bağlantısı kurulamadı (${error.name}). Atlas erişimini ve .env ayarlarını kontrol et.`
    : "MONGODB_URI tanımlı değil");
  process.exitCode = 1;
}
