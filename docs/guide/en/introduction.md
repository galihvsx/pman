# Introduction to p-man

p-man is a WhatsApp bot framework built on top of [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). This framework provides a modular and extensible architecture for building WhatsApp bots easily.

## Key Features

- **Command System**: Flexible command system with decorator and class-based support
- **Listener System**: Event listeners for various WhatsApp events
- **Plugin System**: Plugin architecture to extend functionality
- **Prefix Support**: Support single or multiple prefixes
- **Mention Support**: Optional trigger via bot mention
- **Built on Bun**: Optimized performance with Bun runtime

## Core Concepts

p-man consists of three main components:

| Component | Description |
|-----------|-------------|
| **Command** | Handler for user commands (e.g., `.ping`, `.help`) |
| **Listener** | Event listener for WhatsApp events (`message_create`, `ready`, etc.) |
| **Plugin** | Separate module for grouping commands and listeners |

## Installation

```bash
bun add @galihz/pman whatsapp-web.js
```

Or with npm/yarn:

```bash
npm install @galihz/pman whatsapp-web.js
```

## Quick Start

```typescript
import { PmanClient, Command, Plugin, Listener } from "@galihz/pman";

// Create client
const client = new PmanClient({
    prefix: ".",
    authStrategy: new LocalAuth({}),
    puppeteer: { headless: true }
});

// Register command
client.commands.register(new MyCommand());

// Register listener
client.listenerStore.register(new MyListener());

// Register plugin
client.plugins.register(new MyPlugin());

// Initialize
client.initialize();
```

## Project Structure

```
pman/
├── src/
│   └── lib/
│       ├── PmanClient.ts
│       ├── decorators/
│       ├── handlers/
│       ├── stores/
│       └── structures/
├── example/
│   ├── commands/
│   ├── listeners/
│   ├── plugins/
│   └── index.ts
└── docs/
    └── guide/
```

## Continue with Tutorials

- [Setup Project](./setup.md) - Setup p-man project from scratch
- [Commands](./commands.md) - Create and manage commands
- [Listeners](./listeners.md) - Use event listeners
- [Plugins](./plugins.md) - Create separate plugins
- [API Reference](./api.md) - Complete API reference
