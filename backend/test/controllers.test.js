import test from "node:test";
import assert from "node:assert/strict";
import { events } from "../src/data/events.js";
import { getEvents, getEventById, createEvent } from "../src/controllers/event-controller.js";

function mockResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
  };
}

test("GET /events: 6 kayit", () => {
  const res = mockResponse();
  getEvents({ query: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.length, 6);
  assert.equal(res.payload[1].id, "event-2");
});

test("GET /events?category=Atölye: filtre", () => {
  const res = mockResponse();
  getEvents({ query: { category: "Atölye" } }, res);
  assert.ok(res.payload.length > 0);
  assert.ok(res.payload.every((event) => event.category === "Atölye"));
});

test("GET /events/event-2: 200", () => {
  const res = mockResponse();
  getEventById({ params: { id: "event-2" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.id, "event-2");
});

test("GET /events/yok: 404", () => {
  const res = mockResponse();
  getEventById({ params: { id: "yok" } }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.payload.error.message, "Event not found");
});



test("GET /events?minCapacity=50: en az 50 kontenjan", () => {
  const res = mockResponse();
  getEvents({ query: { minCapacity: "50" } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload.map((event) => event.id), ["event-1", "event-4", "event-5"]);
  assert.ok(res.payload.every((event) => event.capacity >= 50));
});

test("GET /events?mode=online: çevrim içi etkinlik", () => {
  const res = mockResponse();
  getEvents({ query: { mode: "online" } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload.map((event) => event.id), ["event-5"]);
});

test("GET /events?mode=hibrit&minCapacity=50: birleşik filtre", () => {
  const res = mockResponse();
  getEvents({ query: { mode: "hibrit", minCapacity: "50" } }, res);
  assert.deepEqual(res.payload.map((event) => event.id), ["event-4"]);
});

test("GET /events?minCapacity=abc: geçersiz eşik 400", () => {
  const res = mockResponse();
  getEvents({ query: { minCapacity: "abc" } }, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.payload.error.message.includes("minCapacity"));
});

test("GET /events?mode=bilinmiyor: geçersiz tür 400", () => {
  const res = mockResponse();
  getEvents({ query: { mode: "bilinmiyor" } }, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.payload.error.message.includes("mode"));
});

test("POST /events: 201 ve yeni kayit", () => {
  const res = mockResponse();
  createEvent({ body: {
    title: "Test", category: "Atölye", date: "2026-12-30", capacity: 30,
  } }, res);
  assert.equal(res.statusCode, 201);
  assert.match(res.payload.id, /^event-\d+$/);
  assert.equal(events.length, 7);
  assert.equal(res.payload.capacity, 30);
  assert.equal(res.payload.mode, "yuz-yuze");
});

test("POST /events: eksik alan 400", () => {
  const res = mockResponse();
  createEvent({ body: { title: "Eksik" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error.message, "title, category and date are required");
  assert.equal(events.length, 7);
});

test("GET /events?q=sensör: özgün başlık araması", () => {
  const res = mockResponse();
  getEvents({ query: { q: "SENSÖR" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.length, 1);
  assert.equal(res.payload[0].id, "event-2");
});

test("GET /events?q=olmayan: boş dizi", () => {
  const res = mockResponse();
  getEvents({ query: { q: "Olmayan-Bir-Etkinlik" } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, []);
});


test("POST /events: özel etkinlik türünü kabul et", () => {
  const res = mockResponse();
  createEvent({ body: {
    title: "Uzaktan Workshop", category: "Atölye", date: "2026-12-31", mode: "online",
  } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.mode, "online");
});
