# Setup Project

Panduan setup project p-man dari awal.

## Prasyarat

- **Node.js** atau **Bun** (direkomendasikan)
- TypeScript 5.0+

## Inisialisasi Project

Buat project baru dengan Bun:

```bash
mkdir my-whatsapp-bot
cd my-whatsapp-bot
bun init -y
```

## Instalasi Dependensi

```bash
bun add p-man whatsapp-web.js qrcode-terminal reflect-metadata uuid
bun add -d @types/bun @types/qrcode-terminal typescript
```

## Konfigurasi TypeScript

Buat file `tsconfig.json`:

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
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Struktur Project Dasar

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

Buat direktori yang diperlukan:

```bash
mkdir -p src/commands src/listeners src/plugins
```

## Entry Point

Buat file `src/index.ts`:

```typescript
import qrcode from "qrcode-terminal";
import { LocalAuth, type Message } from "whatsapp-web.js";
import { MessageHandler, PmanClient } from "pman";

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
    console.log("Scan QR code ini:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client siap!");
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
            await message.reply("Terjadi kesalahan.");
        }
    }
});

// Register commands, listeners, plugins disini
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

## Jalankan Project

```bash
bun run dev
```

Scan QR code yang muncul di terminal dengan WhatsApp Anda dan bot akan online!

## Langkah Selanjutnya

- [Commands](./commands.md) - Buat command pertamamu
- [Listeners](./listeners.md) - Tambahkan event listeners
- [Plugins](./plugins.md) - Organisir code dengan plugins
