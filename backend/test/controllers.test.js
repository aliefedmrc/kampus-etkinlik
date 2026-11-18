import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { seedEvents } from "../src/data/seed-events.js";
import { Event } from "../src/models/event-model.js";
import { getEvents, getEventById, createEvent } from "../src/controllers/event-controller.js";

function mockResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
  };
}

const modelEvents = seedEvents.map((data) => new Event(data));

for (const [query, filter, expected] of [
  [{}, {}, modelEvents],
  [{ category: "Atölye" }, { category: "Atölye" }, [modelEvents[1], modelEvents[2]]],
  [{ minCapacity: "50" }, { capacity: { $gte: 50 } }, [modelEvents[0], modelEvents[3], modelEvents[4]]],
  [{ mode: "online" }, { mode: "online" }, [modelEvents[4]]],
  [{ mode: "hibrit", minCapacity: "50" }, { mode: "hibrit", capacity: { $gte: 50 } }, [modelEvents[3]]],
  [{ q: "SENSÖR" }, {}, [modelEvents[1]]],
  [{ q: "olmayan" }, {}, []],
]) {
  test(`GET /events: ${JSON.stringify(query)}`, async (t) => {
    const candidates = Object.keys(filter).length ? expected : modelEvents;
    t.mock.method(Event, "find", (actualFilter) => {
      assert.deepEqual(actualFilter, filter);
      return {
        sort(specification) {
          assert.deepEqual(specification, { date: 1 });
          return Promise.resolve(candidates);
        },
      };
    });

    const res = mockResponse();
    await getEvents({ query }, res, assert.ifError);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.payload, expected);
  });
}

for (const query of [{ minCapacity: "abc" }, { mode: "bilinmiyor" }]) {
  test(`GET /events: geçersiz filtre ${JSON.stringify(query)}`, async (t) => {
    const find = t.mock.method(Event, "find");
    const res = mockResponse();
    await getEvents({ query }, res, assert.ifError);
    assert.equal(res.statusCode, 400);
    assert.equal(find.mock.callCount(), 0);
  });
}

test("GET /events/:id: gerçek, bulunamayan ve geçersiz kimlikler", async (t) => {
  const event = modelEvents[1];
  const findById = t.mock.method(Event, "findById", async (id) =>
    id === event._id.toString() ? event : null,
  );

  const found = mockResponse();
  await getEventById({ params: { id: event._id.toString() } }, found, assert.ifError);
  assert.equal(found.payload, event);

  for (const id of [new mongoose.Types.ObjectId().toString(), "yok", "event-2"]) {
    const missing = mockResponse();
    await getEventById({ params: { id } }, missing, assert.ifError);
    assert.equal(missing.statusCode, 404);
    assert.equal(missing.payload.error.message, "Event not found");
  }
  assert.equal(findById.mock.callCount(), 2);
});

test("POST /events: şema alanlarını doğrular ve varsayılan değerleri uygular", async (t) => {
  t.mock.method(Event, "create", async (data) => {
    const event = new Event(data);
    await event.validate();
    return event;
  });

  const valid = { title: "  Test Etkinliği  ", category: "Atölye", date: "2026-12-30" };
  for (const mode of [undefined, "online"]) {
    const res = mockResponse();
    await createEvent({ body: { ...valid, mode } }, res, assert.ifError);
    assert.equal(res.statusCode, 201);
    assert.match(res.payload._id.toString(), /^[a-f0-9]{24}$/);
    assert.equal(res.payload.title, "Test Etkinliği");
    assert.equal(res.payload.capacity, 0);
    assert.equal(res.payload.mode, mode ?? "yuz-yuze");
  }

  for (const body of [{ title: "Eksik" }, { ...valid, category: "Parti" }, { ...valid, title: "X" }]) {
    const invalid = mockResponse();
    await createEvent({ body }, invalid, assert.ifError);
    assert.equal(invalid.statusCode, 400);
    assert.ok(invalid.payload.error.message);
  }
});
