import { describe, test, expect } from "bun:test";
import { Plugin } from "./Plugin";

describe("Plugin", () => {
  test("should create plugin with name", () => {
    const plugin = new (class TestPlugin extends Plugin {
      name = "test";
    })();
    expect(plugin.name).toBe("test");
  });
});
