# P-Man Framework Design

**Date:** 2026-02-16  
**Status:** Approved

## Overview

A WhatsApp framework built on whatsapp-web.js, inspired by Sapphire for Discord. Provides a structured, plugin-based architecture for building WhatsApp bots with commands, listeners, and plugins.

## Architecture

```
PmanClient (extends whatsapp-web.js Client)
    │
    ├── CommandStore     — manages registered commands
    ├── ListenerStore    — manages event listeners  
    └── PluginStore      — manages plugins
```

### Core Files

- `src/lib/PmanClient.ts` — Main client extending wwebjs Client
- `src/lib/stores/CommandStore.ts` — Command registration & lookup
- `src/lib/stores/ListenerStore.ts` — Event listener registration
- `src/lib/stores/PluginStore.ts` — Plugin management
- `src/lib/structures/Command.ts` — Command class with decorator support
- `src/lib/structures/Listener.ts` — Event listener class
- `src/lib/structures/Plugin.ts` — Plugin base class
- `src/lib/structures/CommandContext.ts` — Context passed to commands

## Command System

### Registration

```ts
@Command({ name: 'ping', description: 'Ping the bot' })
ping(context: CommandContext) {
    context.reply('Pong!');
}
```

### Configuration Options

```ts
interface CommandOptions {
  name: string;
  description?: string;
  prefix?: string | string[];      // default: ['!']
  prefixEnabled?: boolean;         // default: true
  mentionEnabled?: boolean;        // default: false
  aliases?: string[];              // alternative names
}
```

### Global Client Options

```ts
interface PmanOptions {
  prefix?: string | string[];      // default: ['!']
  prefixEnabled?: boolean;         // default: true
  mentionEnabled?: boolean;        // default: false
}
```

### CommandContext

- `message` — WhatsApp message object
- `args` — parsed arguments as array
- `reply(content)` — reply to the message
- `client` — reference to PmanClient

### Argument Parsing

- Default: split by space, preserve quoted strings
- Types: `string`, `number`, `boolean`, `user`, `contact`, `group`

## Listener System

```ts
@Listener({ event: 'message_create' })
onMessage(message: Message) {
    console.log('New message:', message.body);
}
```

**Supported Events:** All whatsapp-web.js events (`message`, `message_create`, `message_ack`, `group_join`, `connection`, `disconnected`, `qr`, etc.)

## Plugin System

```ts
class ModerationPlugin extends Plugin {
    name = 'moderation';
    version = '1.0.0';
    
    onLoad() {
        // Register commands/listeners
    }
    
    onUnload() {
        // Cleanup
    }
}

// Usage
client.plugins.register(new ModerationPlugin());
```

### Plugin Lifecycle

- `onLoad()` — Called when plugin is registered
- `onUnload()` — Called when plugin is unloaded/removed

## Data Flow

```
WhatsApp Event → PmanClient 
    → ListenerStore (if listener for this event) → execute listeners
    → MessageHandler (if message)
        → Check prefix/mention → Find command → Execute command
```

## Error Handling

- Command errors: catch, log, optionally reply with error message
- Listener errors: catch, log, continue processing
- Plugin errors: emit warning, allow other plugins to continue

## MVP Features

1. Command System with decorators and argument parsing
2. Event Listener System for all WhatsApp events
3. Plugin System for extendable modules
