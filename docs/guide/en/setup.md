# Setup Project

Guide to setting up a p-man project from scratch.

## Prerequisites

- **Node.js** or **Bun** (recommended)
- TypeScript 5.0+

## Initialize Project

Create a new project with Bun:

```bash
mkdir my-whatsapp-bot
cd my-whatsapp-bot
bun init -y
```

## Install Dependencies

```bash
bun add @galihvsx/pman whatsapp-web.js
bun add -d @types/bun @types/qrcode-terminal typescript
```

## TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "moduleResolution": "bundler",
    "types": ["bun-types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Basic Project Structure

```
my-whatsapp-bot/
├── src/
│   ├── commands/
│   ├── listeners/
│   ├── plugins/
│   └── index.ts
├── package.json
└── tsconfig.json
```

Create required directories:

```bash
mkdir -p src/commands src/listeners src/plugins
```

## Entry Point

Create `src/index.ts`:

```typescript
import qrcode from "qrcode-terminal";
import { LocalAuth, type Message } from "whatsapp-web.js";
import { MessageHandler, PmanClient } from "@galihz/pman";

const client = new PmanClient({
    prefix: "!",
    prefixEnabled: true,
    mentionEnabled: false,
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox"]
    }
});

const messageHandler = new MessageHandler();

// WhatsApp listeners
client.on("qr", (qr: string) => {
    console.log("Scan this QR code:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
});

// Command handler
client.on("message_create", async (message: Message) => {
    if (message.fromMe) return;

    const content = message.body;
    const prefix = client.pmanOptions.prefix;

    if (!messageHandler.matchesPrefix(content, prefix as string))
        return;

    const [commandName, ...args] = messageHandler.parseArgs(
        content.slice((prefix as string).length)
    );

    const command = commandName
        ? client.commands.get(commandName.toLowerCase())
        : undefined;

    if (command) {
        try {
            await command.run({
                message,
                args,
                reply: (content: string) => message.reply(content),
                client
            });
        } catch (error) {
            console.error(`Error executing ${command.name}:`, error);
            await message.reply("An error occurred.");
        }
    }
});

// Register commands, listeners, plugins here
// client.commands.register(new PingCommand());
// client.listenerStore.register(new MessageListener());
// client.plugins.register(new LoggingPlugin());

client.initialize();
```

## Update package.json

```json
{
  "type": "module",
  "scripts": {
    "dev": "bun --hot src/index.ts"
  }
}
```

## Run the Project

```bash
bun run dev
```

Scan the QR code that appears in the terminal with your WhatsApp, and the bot will be online!

## Next Steps

- [Commands](./commands.md) - Create your first command
- [Listeners](./listeners.md) - Add event listeners
- [Plugins](./plugins.md) - Organize code with plugins
