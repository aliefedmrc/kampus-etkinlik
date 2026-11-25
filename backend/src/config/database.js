import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI tanımlı değil");

  await mongoose.connect(uri);
  // Sprint 8 kayıtlarındaki YYYY-MM-DD metinlerini MongoDB Date türüne geçir.
  await mongoose.connection.collection("events").updateMany(
    { date: { $type: "string", $regex: /^\d{4}-\d{2}-\d{2}$/ } },
    [{ $set: { date: { $convert: { input: "$date", to: "date", onError: "$date" } } } }],
  );
  const { host, name } = mongoose.connection;
  const environment = uri.startsWith("mongodb+srv://") ? "Atlas" : "yerel";
  console.log(`MongoDB bağlandı (${environment}): ${host}/${name}`);
}
