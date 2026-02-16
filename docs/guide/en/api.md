# API Reference

## Classes

### PmanClient

Main client that extends `whatsapp-web.js` Client.

#### Constructor

```typescript
constructor(options: PmanOptions = {})
```

#### Options

```typescript
interface PmanOptions extends ClientOptions {
    prefix?: string | string[];        // Default: ["!"]
    prefixEnabled?: boolean;          // Default: true
    mentionEnabled?: boolean;         // Default: false
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `commands` | `CommandStore` | Store for all commands |
| `listenerStore` | `ListenerStore` | Store for all listeners |
| `plugins` | `PluginStore` | Store for all plugins |
| `pmanOptions` | `PmanOptions` | p-man configuration |

#### Methods

Inherits all methods from `whatsapp-web.js` Client:

- `initialize()` - Initialize WhatsApp client
- `on(event, listener)` - Add event listener
- `off(event, listener)` - Remove event listener
- `sendMessage(to, content, options)` - Send message
- And more...

### Command

Base class for creating bot commands.

#### Constructor

```typescript
constructor(options: CommandOptions)
```

#### Options

```typescript
interface CommandOptions {
    name: string;                      // Required: command name
    description?: string;              // Description
    prefix?: string | string[];        // Custom prefix
    prefixEnabled?: boolean;           // Default: true
    mentionEnabled?: boolean;          // Default: false
    aliases?: string[];                // Alternative names
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Command name |
| `description` | `string \| undefined` | Command description |
| `options` | `CommandOptions` | Command configuration |

#### Methods

##### `run(context: CommandContext): Promise<any> | any`

Override to implement command logic.

```typescript
interface CommandContext {
    message: Message;
    args: string[];
    reply: (content: string) => Promise<Message>;
    client: any;
}
```

### Listener

Base class for event listeners.

#### Constructor

```typescript
constructor(options: ListenerOptions)
```

#### Options

```typescript
interface ListenerOptions {
    event: string;        // Required: WhatsApp event name
    name?: string;        // Listener name (defaults to event)
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `event` | `string` | Event name |
| `name` | `string` | Listener name |

#### Methods

##### `run(...args: any[]): Promise<any> | any`

Override to implement listener logic.

### Plugin

Base class for plugins.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `"plugin"` | Plugin name |
| `version` | `string` | `"1.0.0"` | Plugin version |
| `description` | `string \| undefined` | Description |

#### Methods

##### `onLoad?(client: PmanClient): void`

Called when plugin is loaded.

##### `onUnload?(): void`

Called when plugin is unloaded.

## Decorators

### @command

Decorator for creating commands using decorator pattern.

```typescript
@command(options: CommandOptions)
async methodName(context: CommandContext) {
    // implementation
}
```

## Stores

### CommandStore

Stores and manages commands.

#### Methods

```typescript
register(command: Command): void
get(name: string): Command | undefined
has(name: string): boolean
delete(name: string): boolean
values(): IterableIterator<Command>
keys(): IterableIterator<string>
clear(): void
```

### ListenerStore

Stores and manages listeners.

#### Methods

```typescript
register(listener: Listener): void
get(event: string): Listener | undefined
has(event: string): boolean
delete(event: string): boolean
values(): IterableIterator<Listener>
keys(): IterableIterator<string>
clear(): void
```

### PluginStore

Stores and manages plugins.

#### Methods

```typescript
register(plugin: Plugin): void
get(name: string): Plugin | undefined
has(name: string): boolean
delete(name: string): boolean
values(): IterableIterator<Plugin>
keys(): IterableIterator<string>
clear(): void
```

## Handlers

### MessageHandler

Utility for handling messages.

#### Methods

##### `matchesPrefix(content: string, prefix: string | string[]): boolean`

Check if content matches the prefix.

##### `parseArgs(content: string): string[]`

Parse content into array of arguments.

## TypeScript Types

### PmanOptions

```typescript
interface PmanOptions extends ClientOptions {
    prefix?: string | string[];
    prefixEnabled?: boolean;
    mentionEnabled?: boolean;
}
```

### CommandOptions

```typescript
interface CommandOptions {
    name: string;
    description?: string;
    prefix?: string | string[];
    prefixEnabled?: boolean;
    mentionEnabled?: boolean;
    aliases?: string[];
}
```

### CommandContext

```typescript
interface CommandContext {
    message: Message;
    args: string[];
    reply: (content: string) => Promise<Message>;
    client: any;
}
```

### ListenerOptions

```typescript
interface ListenerOptions {
    event: string;
    name?: string;
}
```

## Exports

All exports can be imported from the entry point:

```typescript
// Classes
export { PmanClient } from "./src/lib/PmanClient";
export { Command, type CommandContext, type CommandOptions } from "./src/lib/structures/Command";
export { Listener, type ListenerOptions } from "./src/lib/structures/Listener";
export { Plugin } from "./src/lib/structures/Plugin";

// Decorators
export { command } from "./src/lib/decorators/command";

// Stores
export { CommandStore } from "./src/lib/stores/CommandStore";
export { ListenerStore } from "./src/lib/stores/ListenerStore";
export { PluginStore } from "./src/lib/stores/PluginStore";

// Handlers
export { MessageHandler } from "./src/lib/handlers/MessageHandler";
```
