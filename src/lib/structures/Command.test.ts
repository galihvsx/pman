import { describe, test, expect } from "bun:test";
import { Command } from "./Command";

describe("Command", () => {
  test("should create command with name", () => {
    const cmd = new Command({ name: "ping" });
    expect(cmd.name).toBe("ping");
  });

  test("should have default options", () => {
    const cmd = new Command({ name: "ping" });
    expect(cmd.options.prefixEnabled).toBe(true);
    expect(cmd.options.mentionEnabled).toBe(false);
    expect(cmd.options.prefix).toEqual(["!"]);
  });
});
