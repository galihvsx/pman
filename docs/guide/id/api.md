# API Reference

## Classes

### PmanClient

Client utama yang extends `whatsapp-web.js` Client.

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
| `commands` | `CommandStore` | Store untuk semua commands |
| `listenerStore` | `ListenerStore` | Store untuk semua listeners |
| `plugins` | `PluginStore` | Store untuk semua plugins |
| `pmanOptions` | `PmanOptions` | Konfigurasi p-man |

#### Methods

Mewarisi semua methods dari `whatsapp-web.js` Client:

- `initialize()` - Initialize WhatsApp client
- `on(event, listener)` - Add event listener
- `off(event, listener)` - Remove event listener
- `sendMessage(to, content, options)` - Send message
- Dan lainnya...

### Command

Base class untuk membuat command bot.

#### Constructor

```typescript
constructor(options: CommandOptions)
```

#### Options

```typescript
interface CommandOptions {
    name: string;                      // Required: nama command
    description?: string;              // Deskripsi
    prefix?: string | string[];        // Custom prefix
    prefixEnabled?: boolean;           // Default: true
    mentionEnabled?: boolean;          // Default: false
    aliases?: string[];                // Alternative names
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Nama command |
| `description` | `string \| undefined` | Deskripsi command |
| `options` | `CommandOptions` | Konfigurasi command |

#### Methods

##### `run(context: CommandContext): Promise<any> | any`

Override untuk implementasi command logic.

```typescript
interface CommandContext {
    message: Message;
    args: string[];
    reply: (content: string) => Promise<Message>;
    client: any;
}
```

### Listener

Base class untuk event listener.

#### Constructor

```typescript
constructor(options: ListenerOptions)
```

#### Options

```typescript
interface ListenerOptions {
    event: string;        // Required: nama event WhatsApp
    name?: string;        // Nama listener (default=event)
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `event` | `string` | Nama event |
| `name` | `string` | Nama listener |

#### Methods

##### `run(...args: any[]): Promise<any> | any`

Override untuk implementasi listener logic.

### Plugin

Base class untuk plugin.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `"plugin"` | Nama plugin |
| `version` | `string` | `"1.0.0"` | Versi plugin |
| `description` | `string \| undefined` | Deskripsi |

#### Methods

##### `onLoad?(client: PmanClient): void`

Dipanggil saat plugin di-load.

##### `onUnload?(): void`

Dipanggil saat plugin di-unload.

## Decorators

### @command

Decorator untuk membuat command dengan pattern decorator-based.

```typescript
@command(options: CommandOptions)
async methodName(context: CommandContext) {
    // implementation
}
```

## Stores

### CommandStore

Menyimpan dan manages commands.

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

Menyimpan dan manages listeners.

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

Menyimpan dan manages plugins.

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

Utility untuk handling messages.

#### Methods

##### `matchesPrefix(content: string, prefix: string | string[]): boolean`

Cek apakah content sesuai dengan prefix.

##### `parseArgs(content: string): string[]`

Parse content menjadi array of arguments.

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

Semua exports dapat di-import dari entry point:

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
