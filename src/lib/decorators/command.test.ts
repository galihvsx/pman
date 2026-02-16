import "reflect-metadata";
import { describe, test, expect, beforeEach } from "bun:test";
import { Command } from "../structures/Command";
import type { CommandOptions } from "../structures/Command";
import { command } from "./command";

describe("@command decorator", () => {
  test("should decorate a function", () => {
    let called = false;
    
    class MyCommands {
      @command({ name: "ping" })
      ping() {
        called = true;
      }
    }
    
    const instance = new MyCommands();
    const cmd = Reflect.getMetadata("command:ping", instance);
    
    expect(cmd).toBeDefined();
    expect(cmd.name).toBe("ping");
  });
});
