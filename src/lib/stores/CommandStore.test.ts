import { describe, test, expect } from "bun:test";
import { CommandStore } from "./CommandStore";
import { Command } from "../structures/Command";

describe("CommandStore", () => {
  test("should register and get command", () => {
    const store = new CommandStore();
    const cmd = new Command({ name: "ping" });
    
    store.register(cmd);
    
    expect(store.get("ping")).toBe(cmd);
  });

  test("should find command by alias", () => {
    const store = new CommandStore();
    const cmd = new Command({ name: "ping", aliases: ["p"] });
    
    store.register(cmd);
    
    expect(store.get("p")).toBe(cmd);
  });
});
