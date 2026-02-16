import { describe, test, expect } from "bun:test";
import { Listener } from "./Listener";

describe("Listener", () => {
  test("should create listener with event name", () => {
    const listener = new Listener({ event: "message_create" });
    expect(listener.event).toBe("message_create");
  });
});
