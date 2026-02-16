import { describe, test, expect } from "bun:test";
import { PmanClient } from "./PmanClient";

describe("PmanClient", () => {
  test("should have commandStore", () => {
    const client = new PmanClient({ puppeteer: { headless: true } });
    expect(client.commands).toBeDefined();
    expect(client.listeners).toBeDefined();
    expect(client.plugins).toBeDefined();
  });
});
