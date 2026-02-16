import { describe, test, expect, mock } from "bun:test";
import { PmanClient } from "../PmanClient";

describe("Event Integration", () => {
  test("should register listener for message_create", () => {
    const client = new PmanClient({ puppeteer: { headless: true } });
    const handler = mock(() => {});
    
    client.on("message_create", handler);
    
    expect(client.listenerCount("message_create")).toBeGreaterThan(0);
  });
});
