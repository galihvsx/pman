# p-man

<p align="center">
  <h1>p-man</h1>
  <p>Modular WhatsApp Bot Framework</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@galihz/pman"><img src="https://img.shields.io/npm/v/@galihz/pman" alt="NPM version"></a>
  <a href="https://github.com/galihz/pman/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@galihz/pman" alt="License"></a>
</p>

<p align="center">
  A modular and extensible WhatsApp bot framework built on <a href="https://github.com/pedroslopez/whatsapp-web.js">whatsapp-web.js</a>, optimized with <a href="https://bun.sh">Bun</a> runtime.
</p>

## Features

- ✨ **Command System** - Flexible command system with decorator and class-based support
- 🎧 **Listener System** - Event listeners for various WhatsApp events
- 🔌 **Plugin System** - Modular plugin architecture
- 🎯 **Prefix Support** - Support single or multiple prefixes
- 📱 **Mention Support** - Trigger commands via bot mention
- ⚡ **Powered by Bun** - Maximum performance with Bun runtime
- 📝 **TypeScript Full** - Type safety with TypeScript
- 🧩 **Extensible** - Easy to customize and extend

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
import { PmanClient, Command, type CommandContext } from "@galihz/pman";
import { LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new PmanClient({
    prefix: "!",
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
});

class PingCommand extends Command {
    constructor() {
        super({ name: "ping", description: "Test connection" });
    }

    override async run(context: CommandContext) {
        await context.reply("Pong! 🏓");
    }
}

client.commands.register(new PingCommand());
client.initialize();
```

See the [Full Documentation](./docs/guide/index.md) for detailed guides.

## Basic Structure

```typescript
import { PmanClient, Command, Listener, Plugin } from "@galihz/pman";

const client = new PmanClient({ prefix: "." });

client.commands.register(new MyCommand());
client.listenerStore.register(new MyListener());
client.plugins.register(new MyPlugin());

client.initialize();
```

## Core Components

### Commands

Commands are handlers for user commands.

```typescript
class HelpCommand extends Command {
    constructor() {
        super({ 
            name: "help", 
            description: "Show help",
            aliases: ["h", "assist"]
        });
    }

    override async run(context: CommandContext) {
        await context.reply("Command list: ping, help, etc.");
    }
}
```

### Listeners

Listeners respond to various WhatsApp events.

```typescript
class MessageListener extends Listener {
    constructor() {
        super({ event: "message_create" });
    }

    override async run(message: Message) {
        console.log(`Message: ${message.body}`);
    }
}
```

### Plugins

Plugins organize commands and listeners into separate modules.

```typescript
class LoggingPlugin extends Plugin {
    override name = "logging";
    override version = "1.0.0";

    override onLoad(client: PmanClient) {
        console.log("Plugin loaded!");
    }
}
```

## Documentation

### 🇬🇧 English (Primary)

- [Introduction](./docs/guide/en/introduction.md) - About p-man
- [Setup](./docs/guide/en/setup.md) - Setup from scratch
- [Commands](./docs/guide/en/commands.md) - Create commands
- [Listeners](./docs/guide/en/listeners.md) - Event listeners
- [Plugins](./docs/guide/en/plugins.md) - Plugin system
- [API Reference](./docs/guide/en/api.md) - Complete API reference
- [Recipes](./docs/guide/en/recipes.md) - Example bots

### 🇮🇩 Bahasa Indonesia

- [Pengenalan](./docs/guide/id/index.md) - Tentang p-man
- [Setup Project](./docs/guide/id/setup.md) - Setup dari awal
- [Commands](./docs/guide/id/commands.md) - Membuat commands
- [Listeners](./docs/guide/id/listeners.md) - Event listeners
- [Plugins](./docs/guide/id/plugins.md) - Plugin system
- [API Reference](./docs/guide/id/api.md) - Referensi API lengkap
- [Recipes](./docs/guide/id/recipes.md) - Contoh-contoh bot

## Example Bot

See the [example](./example) folder for a complete implementation:

```bash
bun run dev
```

## Contributing

Contributions are welcome! Feel free to submit Pull Requests or open Issues.

## License

MIT License - see [LICENSE](./LICENSE) for details

## Built With

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [Bun](https://bun.sh) - JavaScript/TypeScript Runtime
- [TypeScript](https://www.typescriptlang.org/) - Type safety
