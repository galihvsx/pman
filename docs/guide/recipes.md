# Recipes & Examples

Kumpulan contoh bot WhatsApp yang bisa dibuat dengan p-man.

## Bot Dasar

### Echo Bot

```typescript
import { Command, type CommandContext } from "pman";

export class EchoCommand extends Command {
    constructor() {
        super({
            name: "echo",
            description: "Ulangi pesan",
        });
    }

    override async run(context: CommandContext) {
        const message = context.args.join(" ");
        if (!message) return await context.reply("Tulis sesuatu!");
        await context.reply(`🔄 ${message}`);
    }
}
```

## Bot Moderasi

### Warn System

```typescript
import { Command, type CommandContext } from "pman";
import type { GroupChat } from "whatsapp-web.js";

class WarnCommand extends Command {
    constructor() {
        super({
            name: "warn",
            description: "Berikan warning ke member",
        });
    }

    override async run(context: CommandContext) {
        const chat = await context.message.getChat();
        if (!(chat instanceof GroupChat)) {
            return await context.reply("Perintah hanya untuk group!");
        }

        const contact = await context.message.getContact();
        const isAdmin = await (chat as any).isAdmin();

        if (!isAdmin) {
            return await context.reply("Hanya admin yang bisa warn!");
        }

        const mentioned = await context.message.getMentions();
        if (mentioned.length === 0) {
            return await context.reply("Tag member yang ingin di-warn!");
        }

        const user = mentioned[0];
        const reason = context.args.slice(1).join(" ") || "Tidak ada alasan";

        await chat.sendMessage(
            `⚠️ @${user.id.user} mendapat warning!\nAlasan: ${reason}`,
            { mentions: [user] }
        );
    }
}
```

### Anti-Delete

```typescript
import { Listener } from "pman";
import type { Message, GroupChat } from "whatsapp-web.js";

export class AntiDeleteListener extends Listener {
    constructor() {
        super({
            event: "message_revoke_everyone"
        });
    }

    async run(message: Message | null, revokedMessage: Message) {
        const chat = await revokedMessage.getChat();
        
        if (chat instanceof GroupChat) {
            const contact = await revokedMessage.getContact();
            const deletedContent = revokedMessage.body;
            
            await chat.sendMessage(
                `🗑️ @${contact.id.user} menghapus pesan:\n"${deletedContent}"`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Bot Entertainment

### Trivia/Tebak Kata

```typescript
import { Command, type CommandContext } from "pman";

const questions = [
    { q: "Ibukota Indonesia?", a: ["jakarta", "dki jakarta"] },
    { q: "2 + 2?", a: ["4", "empat"] },
    { q: "Hewan terbesar di darat?", a: ["gajah", "elephant"] }
];

export class TriviaCommand extends Command {
    constructor() {
        super({
            name: "trivia",
            description: "Tebak pertanyaan!"
        });
    }

    private currentQuestion: { q: string; a: string[] } | null = null;

    override async run(context: CommandContext) {
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        this.currentQuestion = randomQ;
        
        await context.reply(`❓ ${randomQ.q}\nHint: Jawab di chat ini!`);
    }

    async checkAnswer(message: string): Promise<boolean> {
        if (!this.currentQuestion) return false;
        const answer = message.toLowerCase().trim();
        return this.currentQuestion.a.includes(answer);
    }
}
```

### Dadu (Dice Roll)

```typescript
import { Command, type CommandContext } from "pman";

export class DiceCommand extends Command {
    constructor() {
        super({
            name: "dice",
            description: "Roll dadu",
        });
    }

    override async run(context: CommandContext) {
        const sides = parseInt(context.args[0]) || 6;
        const count = Math.min(parseInt(context.args[1]) || 1, 10);

        if (sides < 2 || sides > 100) {
            return await context.reply("Sisi dadu: 2-100");
        }

        const results = Array.from({ length: count }, () => 
            Math.floor(Math.random() * sides) + 1
        );
        const total = results.reduce((a, b) => a + b, 0);

        let response = `🎲 Roll (${count}d${sides}):\n`;
        response += results.map(r => `[${r}]`).join(" ");
        if (count > 1) response += `\nTotal: ${total}`;

        await context.reply(response);
    }
}
```

## Bot Utility

### Short Link

```typescript
import { Command, type CommandContext } from "pman";

export class ShortCommand extends Command {
    constructor() {
        super({
            name: "short",
            description: "Buat short link",
        });
    }

    override async run(context: CommandContext) {
        const url = context.args[0];
        if (!url) return await context.reply("Masukkan URL!");

        try {
            const shortUrl = await this.shorten(url);
            await context.reply(`🔗 ${shortUrl}`);
        } catch (error) {
            await context.reply("Gagal membuat short link");
        }
    }

    private async shorten(url: string): Promise<string> {
        // Implementasi API shortener (tinyurl, bit.ly, dll)
        const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
        );
        return await response.text();
    }
}
```

### Convert File

```typescript
import { Command, type CommandContext } from "pman";
import { MessageMedia } from "whatsapp-web.js";

export class StickerCommand extends Command {
    constructor() {
        super({
            name: "sticker",
            description: "Convert gambar ke sticker"
        });
    }

    override async run(context: CommandContext) {
        const media = await context.message.downloadMedia();
        if (!media || !media.mimetype.includes("image")) {
            return await context.reply("Balas dengan gambar!");
        }

        const sticker = new MessageMedia(
            media.mimetype,
            media.data,
            "sticker.webp"
        );

        await context.message.reply(sticker, undefined, {
            sendMediaAsSticker: true
        });
    }
}
```

## Bot Group Management

### Welcome Message

```typescript
import { Listener } from "pman";
import type { GroupChat } from "whatsapp-web.js";

export class WelcomeListener extends Listener {
    constructor() {
        super({
            event: "group_join",
        });
    }

    async run(notification: any) {
        const chat = await notification.getChat();
        const contact = await notification.getContact();

        if (chat instanceof GroupChat) {
            const welcomeMsg = `
👋 Selamat datang di ${chat.name}!
@${contact.id.user}, harap baca rules group.
            `.trim();

            await chat.sendMessage(welcomeMsg, { mentions: [contact] });
        }
    }
}
```

### Tag All

```typescript
import { Command, type CommandContext } from "pman";
import type { GroupChat } from "whatsapp-web.js";

export class TagAllCommand extends Command {
    constructor() {
        super({
            name: "tagall",
            description: "Tag semua member",
        });
    }

    override async run(context: CommandContext) {
        const chat = await context.message.getChat();
        
        if (!(chat instanceof GroupChat)) {
            return await context.reply("Hanya untuk group!");
        }

        const mentions = await chat.participants;
        const message = context.args.join(" ") || "Halo semuanya!";

        await chat.sendMessage(message, { mentions });
    }
}
```

## Bot Database Integration

### User Stats

```typescript
import { Command, type CommandContext } from "pman";

const userStats = new Map<string, { messages: number; lastSeen: Date }>();

export class StatsCommand extends Command {
    constructor() {
        super({
            name: "stats",
            description: "Statistik pengguna",
        });
    }

    override async run(context: CommandContext) {
        const contact = await context.message.getContact();
        const userId = contact.id._serialized;
        const stats = userStats.get(userId);

        if (!stats) {
            return await context.reply("Belum ada data statistik!");
        }

        await context.reply(`
📊 Statistik @${contact.id.user}:
• Pesan: ${stats.messages}
• Terakhir aktif: ${stats.lastSeen.toLocaleString()}
        `.trim());
    }
}

// Jalankan pada setiap message listener
if (userStats.has(userId)) {
    userStats.set(userId, {
        messages: userStats.get(userId)!.messages + 1,
        lastSeen: new Date()
    });
} else {
    userStats.set(userId, { messages: 1, lastSeen: new Date() });
}
```

## Bot Multi-Language

### Translate

```typescript
import { Command, type CommandContext } from "pman";

export class TranslateCommand extends Command {
    constructor() {
        super({
            name: "translate",
            aliases: ["tr", "terjemah"],
            description: "Terjemahkan teks"
        });
    }

    override async run(context: CommandContext) {
        const targetLang = context.args[0] || "en";
        const text = context.args.slice(1).join(" ");

        if (!text) {
            return await context.reply(
                "Format: !translate <kode_bahasa> <teks>\nContoh: !translate id Hello world"
            );
        }

        try {
            const translated = await this.translate(text, targetLang);
            await context.reply(`🌐 ${translated}`);
        } catch (error) {
            await context.reply("Gagal menerjemahkan");
        }
    }

    private async translate(text: string, target: string): Promise<string> {
        // Implementasi translate (Google Translate, DeepL, dll)
        // ...
        return `[Translated to ${target}]: ${text}`;
    }
}
```
