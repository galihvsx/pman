# p-man Guides

Welcome to the p-man documentation! This framework helps you build modular WhatsApp bots easily.

## Choose Your Language / Pilih Bahasa

| 🇬🇧 English | 🇮🇩 Bahasa Indonesia |
|-------------|----------------------|
| [English Guides](./en/) | [Panduan Bahasa Indonesia](./id/) |

## Quick Start

### Installation

```bash
bun add @galihz/pman whatsapp-web.js
```

Or with npm/yarn:

```bash
npm install @galihz/pman whatsapp-web.js
```

### Basic Usage

```typescript
import { PmanClient, Command, type CommandContext } from "@galihz/pman";
import { LocalAuth } from "whatsapp-web.js";

const client = new PmanClient({
    prefix: "!",
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
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

## Full Documentation

### English (Primary)

- [Introduction](./en/introduction.md) - About p-man
- [Setup](./en/setup.md) - Setup from scratch
- [Commands](./en/commands.md) - Create commands
- [Listeners](./en/listeners.md) - Event listeners
- [Plugins](./en/plugins.md) - Plugin system
- [API Reference](./en/api.md) - Complete API reference
- [Recipes](./en/recipes.md) - Example bots

### Bahasa Indonesia

- [Pengenalan](./id/index.md) - Tentang p-man
- [Setup Project](./id/setup.md) - Setup dari awal
- [Commands](./id/commands.md) - Membuat commands
- [Listeners](./id/listeners.md) - Event listeners
- [Plugins](./id/plugins.md) - Plugin system
- [API Reference](./id/api.md) - Referensi API lengkap
- [Recipes](./id/recipes.md) - Contoh-contoh bot

## Key Features

- ✨ **Command System** - Flexible command system with decorators and classes
- 🎧 **Listener System** - Event listeners for various WhatsApp events
- 🔌 **Plugin System** - Modular plugin architecture
- 🎯 **Prefix Support** - Support single or multiple prefixes
- 📱 **Mention Support** - Trigger commands via bot mention
- ⚡ **Bun Powered** - Optimized performance with Bun runtime
- 📝 **TypeScript Full** - Type safety with TypeScript
- 🧩 **Extensible** - Easy to customize and extend

## Support

- 📖 [Documentation](./en/)
- 🐛 [Issues](https://github.com/galihz/pman/issues)
- 💬 [Discussions](https://github.com/galihz/pman/discussions)
