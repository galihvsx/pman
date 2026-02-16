import { describe, test, expect, vi } from "bun:test";
import { Message } from "whatsapp-web.js";
import { MessageHandler } from "./MessageHandler";

describe("MessageHandler", () => {
  test("should match prefix command", () => {
    const handler = new MessageHandler();
    
    expect(handler.matchesPrefix("!ping", ["!"])).toBe(true);
    expect(handler.matchesPrefix("ping", ["!"])).toBe(false);
    expect(handler.matchesPrefix("/ping", ["/", "!"])).toBe(true);
    expect(handler.matchesPrefix("ping", ["/", "!"])).toBe(false);
  });

  test("should parse arguments correctly", () => {
    const handler = new MessageHandler();
    
    expect(handler.parseArgs("ping")).toEqual(["ping"]);
    expect(handler.parseArgs("ping pong")).toEqual(["ping", "pong"]);
    expect(handler.parseArgs('ping "hello world"')).toEqual(["ping", "hello world"]);
    expect(handler.parseArgs("ping 'hello world'")).toEqual(["ping", "hello world"]);
    expect(handler.parseArgs("ping hello world")).toEqual(["ping", "hello", "world"]);
  });
});
