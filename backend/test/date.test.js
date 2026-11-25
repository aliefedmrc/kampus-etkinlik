import test from "node:test";
import assert from "node:assert/strict";
import { parseDate, formatDate, todayStart } from "../src/utils/date.js";
import { Event } from "../src/models/event-model.js";

test("Tarih dönüşümü UTC kullanır ve artık yılları doğrular", () => {
  assert.equal(parseDate("29-02-2024").toISOString(), "2024-02-29T00:00:00.000Z");
  assert.equal(formatDate(parseDate("01-01-0099")), "01-01-0099");
  for (const value of ["29-02-2026", "31-04-2026", "00-12-2026", "15-13-2026", "2026-12-20", "1-12-2026", 0]) {
    assert.ok(Number.isNaN(parseDate(value).getTime()), String(value));
  }
  const date = parseDate("20-12-2026");
  assert.equal(parseDate(date), date);
});

test("Model Date saklar ve JSON'da GG-AA-YYYY döndürür", async () => {
  const event = new Event({ title: "Tarih testi", category: "Seminer", date: "20-12-2026" });
  await event.validate();
  assert.ok(event.get("date", null, { getters: false }) instanceof Date);
  assert.equal(event.toJSON().date, "20-12-2026");
  assert.ok(!Object.hasOwn(event.toJSON(), "id"));
});

test("Bugünün başlangıcı UTC gece yarısıdır", () => {
  const before = Date.now();
  const start = todayStart();
  const after = Date.now();
  assert.equal(start.getUTCHours(), 0);
  assert.equal(start.getUTCMinutes(), 0);
  assert.equal(start.getUTCSeconds(), 0);
  assert.ok(start.getTime() <= after);
  assert.ok(start.getTime() > before - 86400000);
});
