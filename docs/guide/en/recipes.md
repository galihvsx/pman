# Recipes & Examples

Collection of example WhatsApp bots you can build with p-man.

## Basic Bots

### Echo Bot

```typescript
import { Command, type CommandContext } from "@galihz/pman";

export class EchoCommand extends Command {
    constructor() {
        super({
            name: "echo",
            description: "Repeat a message",
        });
    }

    override async run(context: CommandContext) {
        const message = context.args.join(" ");
        if (!message) return await context.reply("Write something!");
        await context.reply(`🔄 ${message}`);
    }
}
```

## Moderation Bots

### Warn System

```typescript
import { Command, type CommandContext } from "@galihz/pman";
import type { GroupChat } from "whatsapp-web.js";

class WarnCommand extends Command {
    constructor() {
        super({
            name: "warn",
            description: "Give a warning to a member",
        });
    }

    override async run(context: CommandContext) {
        const chat = await context.message.getChat();
        if (!(chat instanceof GroupChat)) {
            return await context.reply("This command is for groups only!");
        }

        const contact = await context.message.getContact();
        const isAdmin = await (chat as any).isAdmin();

        if (!isAdmin) {
            return await context.reply("Only admins can warn!");
        }

        const mentioned = await context.message.getMentions();
        if (mentioned.length === 0) {
            return await context.reply("Tag the member you want to warn!");
        }

        const user = mentioned[0];
        const reason = context.args.slice(1).join(" ") || "No reason specified";

        await chat.sendMessage(
            `⚠️ @${user.id.user} received a warning!\nReason: ${reason}`,
            { mentions: [user] }
        );
    }
}
```

### Anti-Delete

```typescript
import { Listener } from "@galihz/pman";
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
                `🗑️ @${contact.id.user} deleted a message:\n"${deletedContent}"`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Entertainment Bots

### Trivia/Quiz

```typescript
import { Command, type CommandContext } from "@galihz/pman";

const questions = [
    { q: "Capital of Indonesia?", a: ["jakarta", "dki jakarta"] },
    { q: "2 + 2?", a: ["4", "four"] },
    { q: "Largest animal on land?", a: ["elephant", "gajah"] }
];

export class TriviaCommand extends Command {
    constructor() {
        super({
            name: "trivia",
            description: "Guess the answer!"
        });
    }

    private currentQuestion: { q: string; a: string[] } | null = null;

    override async run(context: CommandContext) {
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        this.currentQuestion = randomQ;
        
        await context.reply(`❓ ${randomQ.q}\nHint: Answer in this chat!`);
    }

    async checkAnswer(message: string): Promise<boolean> {
        if (!this.currentQuestion) return false;
        const answer = message.toLowerCase().trim();
        return this.currentQuestion.a.includes(answer);
    }
}
```

### Dice Roll

```typescript
import { Command, type CommandContext } from "@galihz/pman";

export class DiceCommand extends Command {
    constructor() {
        super({
            name: "dice",
            description: "Roll a die",
        });
    }

    override async run(context: CommandContext) {
        const sides = parseInt(context.args[0]) || 6;
        const count = Math.min(parseInt(context.args[1]) || 1, 10);

        if (sides < 2 || sides > 100) {
            return await context.reply("Dice sides: 2-100");
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

## Utility Bots

### Short Link

```typescript
import { Command, type CommandContext } from "@galihz/pman";

export class ShortCommand extends Command {
    constructor() {
        super({
            name: "short",
            description: "Create short link",
        });
    }

    override async run(context: CommandContext) {
        const url = context.args[0];
        if (!url) return await context.reply("Enter a URL!");

        try {
            const shortUrl = await this.shorten(url);
            await context.reply(`🔗 ${shortUrl}`);
        } catch (error) {
            await context.reply("Failed to create short link");
        }
    }

    private async shorten(url: string): Promise<string> {
        // Implement shortener API (tinyurl, bit.ly, etc.)
        const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
        );
        return await response.text();
    }
}
```

### File Converter

```typescript
import { Command, type CommandContext } from "@galihz/pman";
import { MessageMedia } from "whatsapp-web.js";

export class StickerCommand extends Command {
    constructor() {
        super({
            name: "sticker",
            description: "Convert image to sticker"
        });
    }

    override async run(context: CommandContext) {
        const media = await context.message.downloadMedia();
        if (!media || !media.mimetype.includes("image")) {
            return await context.reply("Reply with an image!");
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

## Group Management Bots

### Welcome Message

```typescript
import { Listener } from "@galihz/pman";
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
👋 Welcome to ${chat.name}!
@${contact.id.user}, please read the group rules.
            `.trim();

            await chat.sendMessage(welcomeMsg, { mentions: [contact] });
        }
    }
}
```

### Tag All

```typescript
import { Command, type CommandContext } from "@galihz/pman";
import type { GroupChat } from "whatsapp-web.js";

export class TagAllCommand extends Command {
    constructor() {
        super({
            name: "tagall",
            description: "Tag all members",
        });
    }

    override async run(context: CommandContext) {
        const chat = await context.message.getChat();
        
        if (!(chat instanceof GroupChat)) {
            return await context.reply("Groups only!");
        }

        const mentions = await chat.participants;
        const message = context.args.join(" ") || "Hello everyone!";

        await chat.sendMessage(message, { mentions });
    }
}
```

## Database Integration Bots

### User Stats

```typescript
import { Command, type CommandContext } from "@galihz/pman";

const userStats = new Map<string, { messages: number; lastSeen: Date }>();

export class StatsCommand extends Command {
    constructor() {
        super({
            name: "stats",
            description: "User statistics",
        });
    }

    override async run(context: CommandContext) {
        const contact = await context.message.getContact();
        const userId = contact.id._serialized;
        const stats = userStats.get(userId);

        if (!stats) {
            return await context.reply("No statistics data yet!");
        }

        await context.reply(`
📊 Statistics for @${contact.id.user}:
• Messages: ${stats.messages}
• Last active: ${stats.lastSeen.toLocaleString()}
        `.trim());
    }
}

// Run on every message listener
if (userStats.has(userId)) {
    userStats.set(userId, {
        messages: userStats.get(userId)!.messages + 1,
        lastSeen: new Date()
    });
} else {
    userStats.set(userId, { messages: 1, lastSeen: new Date() });
}
```

## Multi-Language Bots

### Translate

```typescript
import { Command, type CommandContext } from "@galihz/pman";

export class TranslateCommand extends Command {
    constructor() {
        super({
            name: "translate",
            aliases: ["tr"],
            description: "Translate text"
        });
    }

    override async run(context: CommandContext) {
        const targetLang = context.args[0] || "en";
        const text = context.args.slice(1).join(" ");

        if (!text) {
            return await context.reply(
                "Format: !translate <lang_code> <text>\nExample: !translate id Hello world"
            );
        }

        try {
            const translated = await this.translate(text, targetLang);
            await context.reply(`🌐 ${translated}`);
        } catch (error) {
            await context.reply("Translation failed");
        }
    }

    private async translate(text: string, target: string): Promise<string> {
        // Implement translate API (Google Translate, DeepL, etc.)
        // ...
        return `[Translated to ${target}]: ${text}`;
    }
}
```
