# Pengenalan p-man

p-man adalah framework WhatsApp bot yang dibangun di atas [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). Framework ini menyediakan arsitektur yang modular dan extensible untuk membangun bot WhatsApp dengan mudah.

## Fitur Utama

- **Command System**: Sistem perintah yang fleksibel dengan dukungan decorator dan class-based
- **Listener System**: Event listener untuk berbagai event WhatsApp
- **Plugin System**: Arsitektur plugin untuk meng-extend fungsionalitas
- **Prefix Support**: Mendukung satu atau beberapa prefix
- **Mention Support**: Opsional trigger via mention bot
- **Built on Bun**: Mengoptimalkan performa dengan runtime Bun

## Konsep Dasar

p-man terdiri dari tiga komponen utama:

| Komponen | Deskripsi |
|----------|-----------|
| **Command** | Handler untuk perintah yang dipanggil user (misal: `.ping`, `.help`) |
| **Listener** | Event listener untuk berbagai event WhatsApp (`message_create`, `ready`, dll) |
| **Plugin** | Modul terpisah untuk mengelompokkan command dan listener |

## Instalasi

```bash
bun install
```

## Quick Start

```typescript
import { PmanClient, Command, Plugin, Listener } from "pman";

// Buat client
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

## Struktur Project

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

## Lanjut ke Tutorial

- [Setup Project](./setup.md) - Setup project p-man dari awal
- [Commands](./commands.md) - Membuat dan mengelola command
- [Listeners](./listeners.md) - Menggunakan event listeners
- [Plugins](./plugins.md) - Membuat plugin terpisah
- [API Reference](./api.md) - Referensi API lengkap
