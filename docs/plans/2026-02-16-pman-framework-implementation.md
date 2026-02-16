# P-Man Framework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a WhatsApp framework with Commands, Listeners, and Plugins system

**Architecture:** Plugin-based architecture extending whatsapp-web.js Client with decorators for Commands and Listeners, and a store-based system for management

**Tech Stack:** TypeScript, Bun, whatsapp-web.js

---

### Task 1: Set up Project Structure

**Files:**
- Modify: `package.json`

**Step 1: Add dependencies**

Run: `bun add uuid`

**Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add uuid dependency"
```

---

### Task 2: Create Command Structure

**Files:**
- Create: `src/lib/structures/CommandContext.ts`
- Create: `src/lib/structures/Command.ts`
- Create: `src/lib/stores/CommandStore.ts`
- Modify: `src/lib/PmanClient.ts`

**Step 1: Write the failing test**

Create `src/lib/structures/Command.test.ts`:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/structures/Command.test.ts`
Expected: FAIL (files don't exist)

**Step 3: Write minimal implementation**

Create `src/lib/structures/Command.ts`:

```ts
import { Message } from "whatsapp-web.js";

export interface CommandOptions {
  name: string;
  description?: string;
  prefix?: string | string[];
  prefixEnabled?: boolean;
  mentionEnabled?: boolean;
  aliases?: string[];
}

export interface CommandContext {
  message: Message;
  args: string[];
  reply: (content: string) => Promise<Message>;
  client: any;
}

export class Command {
  public name: string;
  public description?: string;
  public options: Required<CommandOptions>;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.options = {
      prefix: options.prefix ?? ["!"],
      prefixEnabled: options.prefixEnabled ?? true,
      mentionEnabled: options.mentionEnabled ?? false,
      aliases: options.aliases ?? [],
    };
  }

  run(context: CommandContext): Promise<any> | any {
    throw new Error("Not implemented");
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/structures/Command.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/structures/Command.ts src/lib/structures/Command.test.ts
git commit -m "feat: add Command structure"
```

---

### Task 3: Create Listener Structure

**Files:**
- Create: `src/lib/structures/Listener.ts`
- Create: `src/lib/stores/ListenerStore.ts`

**Step 1: Write the failing test**

Create `src/lib/structures/Listener.test.ts`:

```ts
import { describe, test, expect } from "bun:test";
import { Listener } from "./Listener";

describe("Listener", () => {
  test("should create listener with event name", () => {
    const listener = new Listener({ event: "message_create" });
    expect(listener.event).toBe("message_create");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/structures/Listener.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Create `src/lib/structures/Listener.ts`:

```ts
export interface ListenerOptions {
  event: string;
  name?: string;
}

export class Listener {
  public event: string;
  public name: string;

  constructor(options: ListenerOptions) {
    this.event = options.event;
    this.name = options.name ?? options.event;
  }

  run(...args: any[]): Promise<any> | any {
    throw new Error("Not implemented");
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/structures/Listener.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/structures/Listener.ts src/lib/structures/Listener.test.ts
git commit -m "feat: add Listener structure"
```

---

### Task 4: Create Plugin Structure

**Files:**
- Create: `src/lib/structures/Plugin.ts`
- Create: `src/lib/stores/PluginStore.ts`

**Step 1: Write the failing test**

Create `src/lib/structures/Plugin.test.ts`:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/structures/Plugin.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Create `src/lib/structures/Plugin.ts`:

```ts
export class Plugin {
  public name: string = "plugin";
  public version: string = "1.0.0";
  public description?: string;

  onLoad?(): void;
  onUnload?(): void;
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/structures/Plugin.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/structures/Plugin.ts src/lib/structures/Plugin.test.ts
git commit -m "feat: add Plugin structure"
```

---

### Task 5: Create Store Classes

**Files:**
- Create: `src/lib/stores/CommandStore.ts`
- Create: `src/lib/stores/ListenerStore.ts`
- Create: `src/lib/stores/PluginStore.ts`

**Step 1: Write the failing test**

Create `src/lib/stores/CommandStore.test.ts`:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/stores/CommandStore.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Create `src/lib/stores/CommandStore.ts`:

```ts
import { Command } from "../structures/Command";

export class CommandStore {
  private commands = new Map<string, Command>();

  register(command: Command): void {
    this.commands.set(command.name, command);
    
    for (const alias of command.options.aliases) {
      this.commands.set(alias, command);
    }
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  values(): IterableIterator<Command> {
    return this.commands.values();
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/stores/CommandStore.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/stores/CommandStore.ts src/lib/stores/CommandStore.test.ts
git commit -m "feat: add CommandStore"
```

---

### Task 6: Integrate Stores into PmanClient

**Files:**
- Modify: `src/lib/PmanClient.ts`

**Step 1: Write the failing test**

Create `src/lib/PmanClient.test.ts`:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/PmanClient.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Modify `src/lib/PmanClient.ts`:

```ts
import { Client, ClientOptions } from "whatsapp-web.js";
import { CommandStore } from "./stores/CommandStore";
import { ListenerStore } from "./stores/ListenerStore";
import { PluginStore } from "./stores/PluginStore";

export interface PmanOptions {
  prefix?: string | string[];
  prefixEnabled?: boolean;
  mentionEnabled?: boolean;
}

export class PmanClient extends Client {
  public commands: CommandStore;
  public listeners: ListenerStore;
  public plugins: PluginStore;
  public options: PmanOptions;

  constructor(options: ClientOptions & PmanOptions = {}) {
    super(options);
    
    this.options = {
      prefix: options.prefix ?? ["!"],
      prefixEnabled: options.prefixEnabled ?? true,
      mentionEnabled: options.mentionEnabled ?? false,
    };
    
    this.commands = new CommandStore();
    this.listeners = new ListenerStore();
    this.plugins = new PluginStore(this);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/PmanClient.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/PmanClient.ts src/lib/PmanClient.test.ts
git commit -m "feat: integrate stores into PmanClient"
```

---

### Task 7: Implement Command Decorator

**Files:**
- Create: `src/lib/decorators/command.ts`

**Step 1: Write the failing test**

Create `src/lib/decorators/command.test.ts`:

```ts
import { describe, test, expect, beforeEach } from "bun:test";
import { Command, CommandOptions } from "../structures/Command";
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
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/decorators/command.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Create `src/lib/decorators/command.ts`:

```ts
import "reflect-metadata";
import { Command, CommandOptions } from "../structures/Command";

export function command(options: CommandOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    class DecoratedCommand extends Command {
      constructor() {
        super(options);
      }
      
      run(context: any) {
        return originalMethod.call(this, context);
      }
    }
    
    Reflect.defineMetadata(`command:${options.name}`, new DecoratedCommand(), target.constructor);
    
    return descriptor;
  };
}
```

Note: Need to add `reflect-metadata` to package.json first.

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/decorators/command.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/decorators/command.ts src/lib/decorators/command.test.ts
git commit -m "feat: add @command decorator"
```

---

### Task 8: Implement Message Handler

**Files:**
- Modify: `src/lib/PmanClient.ts`

**Step 1: Write the failing test**

Create `src/lib/handlers/MessageHandler.test.ts`:

```ts
import { describe, test, expect, vi } from "bun:test";
import { Message } from "whatsapp-web.js";

describe("MessageHandler", () => {
  test("should match prefix command", () => {
    const handler = {
      matchesPrefix: (content: string, prefix: string | string[]) => {
        const prefixes = Array.isArray(prefix) ? prefix : [prefix];
        return prefixes.some(p => content.startsWith(p));
      }
    };
    
    expect(handler.matchesPrefix("!ping", ["!"])).toBe(true);
    expect(handler.matchesPrefix("ping", ["!"])).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/handlers/MessageHandler.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Create `src/lib/handlers/MessageHandler.ts`:

```ts
export class MessageHandler {
  matchesPrefix(content: string, prefix: string | string[]): boolean {
    const prefixes = Array.isArray(prefix) ? prefix : [prefix];
    return prefixes.some(p => content.startsWith(p));
  }

  matchesMention(content: string, client: any): boolean {
    const mentioned = client.pupPage.evaluate(() => {
      // Will be implemented with actual WhatsApp Web API
      return false;
    });
    return false;
  }

  parseArgs(content: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (const char of content) {
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else if (char === " " && !inQuotes) {
        if (current) {
          args.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current) args.push(current);
    return args;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test src/lib/handlers/MessageHandler.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/handlers/MessageHandler.ts src/lib/handlers/MessageHandler.test.ts
git commit -m "feat: add MessageHandler"
```

---

### Task 9: Wire Up Event Listeners

**Files:**
- Modify: `src/lib/PmanClient.ts`

**Step 1: Write the failing test**

Create `src/lib/integration/events.test.ts`:

```ts
import { describe, test, expect } from "bun:test";
import { PmanClient } from "../PmanClient";

describe("Event Integration", () => {
  test("should register listener for message_create", () => {
    const client = new PmanClient({ puppeteer: { headless: true } });
    const handler = vi.fn();
    
    client.on("message_create", handler);
    
    expect(client.listenerCount("message_create")).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test src/lib/integration/events.test.ts`
Expected: PASS (inherits from wwebjs Client)

**Step 3: Commit**

```bash
git commit -m "test: verify event integration works"
```

---

### Task 10: Create Example Plugin

**Files:**
- Create: `src/plugins/ExamplePlugin.ts`

**Step 1: Write the implementation**

Create `src/plugins/ExamplePlugin.ts`:

```ts
import { Plugin } from "../lib/structures/Plugin";
import { PmanClient } from "../lib/PmanClient";

export class ExamplePlugin extends Plugin {
  name = "example";
  version = "1.0.0";
  description = "Example plugin with ping command";

  onLoad(client: PmanClient): void {
    console.log(`Loaded ${this.name} plugin`);
  }

  onUnload(): void {
    console.log(`Unloaded ${this.name} plugin`);
  }
}
```

**Step 2: Commit**

```bash
git add src/plugins/ExamplePlugin.ts
git commit -m "feat: add ExamplePlugin"
```

---

### Task 11: Create index.ts Exports

**Files:**
- Modify: `index.ts`

**Step 1: Write exports**

Modify `index.ts`:

```ts
export { PmanClient } from "./src/lib/PmanClient";
export { Command, CommandOptions, CommandContext } from "./src/lib/structures/Command";
export { Listener, ListenerOptions } from "./src/lib/structures/Listener";
export { Plugin } from "./src/lib/structures/Plugin";
export { CommandStore } from "./src/lib/stores/CommandStore";
export { ListenerStore } from "./src/lib/stores/ListenerStore";
export { PluginStore } from "./src/lib/stores/PluginStore";
export { command } from "./src/lib/decorators/command";
```

**Step 2: Commit**

```bash
git add index.ts
git commit -m "feat: add public exports"
```

---

## Summary

**Total Tasks:** 11

1. Set up Project Structure
2. Create Command Structure
3. Create Listener Structure
4. Create Plugin Structure
5. Create Store Classes
6. Integrate Stores into PmanClient
7. Implement Command Decorator
8. Implement Message Handler
9. Wire Up Event Listeners
10. Create Example Plugin
11. Create index.ts Exports
