# Commands

Commands adalah inti dari interaksi bot. Dengan p-man, Anda bisa membuat commands dengan dua cara: class-based atau decorator-based.

## Command Context

Setiap command menerima context object:

```typescript
interface CommandContext {
    message: Message;
    args: string[];
    reply: (content: string) => Promise<Message>;
    client: PmanClient;
}
```

## Class-Based Commands

Cara tradisional membuat command dengan extend class `Command`.

### Command Options

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

### Contoh Dasar

```typescript
import { Command, type CommandContext } from "pman";

export class PingCommand extends Command {
    constructor() {
        super({
            name: "ping",
            description: "Cek koneksi bot",
        });
    }

    override async run(context: CommandContext) {
        await context.reply("Pong!");
    }
}
```

### Command dengan Aliases

```typescript
export class HelpCommand extends Command {
    constructor() {
        super({
            name: "help",
            description: "Tampilkan bantuan",
            aliases: ["h", "bantuan"],
        });
    }

    override async run(context: CommandContext) {
        const helpText = `
📋 Daftar Commands:
• !ping - Cek koneksi
• !help - Bantuan ini
        `;
        await context.reply(helpText.trim());
    }
}
```

### Command dengan Arguments

```typescript
export class SayCommand extends Command {
    constructor() {
        super({
            name: "say",
            description: "Ulangi pesan",
        });
    }

    override async run(context: CommandContext) {
        const message = context.args.join(" ");
        if (!message) {
            return await context.reply("Tulis sesuatu setelah !say");
        }
        await context.reply(message);
    }
}
```

### Command dengan Prefix Custom

```typescript
export class AdminCommand extends Command {
    constructor() {
        super({
            name: "ban",
            description: "Ban user",
            prefix: "#",     // Menggunakan prefix #
            prefixEnabled: true,    // Aktifkan prefix check
        });
    }

    override async run(context: CommandContext) {
        const userId = context.args[0];
        await context.reply(`User ${userId} di-ban!`);
    }
}
```

## Decorator-Based Commands

Menggunakan decorator untuk membuat command yang lebih clean. Diperlukan konfigurasi `experimentalDecorators` di tsconfig.json.

```typescript
import { command, Command } from "pman";
import type { CommandOptions } from "pman";

class MyCommands {
    @command({
        name: "ping",
        description: "Pong response"
    })
    async ping(context: any) {
        await context.reply("Pong!");
    }

    @command({
        name: "time",
        description: "Show current time"
    })
    async time(context: any) {
        await context.reply(new Date().toString());
    }
}
```

## Contoh Lengkap: Command Register

```typescript
import { PingCommand, HelpCommand, SayCommand } from "./commands";

// Register multiple commands
client.commands.register(new PingCommand());
client.commands.register(new HelpCommand());
client.commands.register(new SayCommand());
```

## Command Store

Command menyimpan semua commands di dalam `CommandStore`:

```typescript
// Get command by name
const pingCommand = client.commands.get("ping");

// Get all commands
const allCommands = Array.from(client.commands.values());

// Check if command exists
const hasPing = client.commands.has("ping");

// Delete command
client.commands.delete("ping");

// Clear all commands
client.commands.clear();
```

## Tips Best Practices

1. **Error Handling**: Selalu wrap command logic dalam try-catch
2. **Validation**: Validasi args sebelum processing
3. **Type Safety**: Gunakan TypeScript untuk args validation
4. **Modular**: Satu file satu command

## Contoh Error Handling

```typescript
export class DiceCommand extends Command {
    constructor() {
        super({
            name: "dice",
            description: "Roll dadu",
        });
    }

    override async run(context: CommandContext) {
        try {
            const sides = parseInt(context.args[0]) || 6;
            if (sides < 2 || sides > 1000) {
                return await context.reply("Sisi harus antara 2-1000");
            }
            const result = Math.floor(Math.random() * sides) + 1;
            await context.reply(`🎲 ${result}/6`);
        } catch (error) {
            console.error(error);
            await context.reply("Terjadi kesalahan saat roll dadu");
        }
    }
}
```
