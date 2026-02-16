# Listeners

Listeners allow your bot to respond to various WhatsApp events, not just user commands.

## Listener Options

```typescript
interface ListenerOptions {
    event: string;      // WhatsApp event name
    name?: string;      // Listener name (optional, defaults to event)
}
```

## Available WhatsApp Events

List of events from whatsapp-web.js:

| Event | Description |
|-------|-------------|
| `ready` | Client is ready to use |
| `qr` | QR code available for scanning |
| `authenticated` | Successfully authenticated |
| `auth_failure` | Authentication failed |
| `message_create` | Message created (including from bot) |
| `message` | Message received |
| `message_ciphertext` | Encrypted message received |
| `message_ack` | Message acknowledgment |
| `message_edit` | Message edited |
| `message_revoke_everyone` | Message deleted for everyone |
| `message_revoke_me` | Message deleted for sender |
| `media_uploaded` | Media uploaded |
| `chat_new` | New chat created |
| `chat_archived` | Chat archived |
| `contact_added` | Contact added |
| `contact_changed` | Contact changed |
| `group_join` | User joined group |
| `group_leave` | User left group |
| `group_admin_changed` | Group admin changed |
| `state_change` | Client state changed |

## Basic Listener

```typescript
import { Listener } from "@galihz/pman";
import type { Message } from "whatsapp-web.js";

export class MessageListener extends Listener {
    constructor() {
        super({
            event: "message"
        });
    }

    override async run(message: Message) {
        console.log(`[Message] ${message.from}: ${message.body}`);
    }
}
```

## Listener for Ready Event

```typescript
export class ReadyListener extends Listener {
    constructor() {
        super({
            event: "ready"
        });
    }

    override async run() {
        console.log("✅ Bot ready and online!");
        console.log(`📊 Number of commands: ${Array.from(client.commands.values()).length}`);
    }
}
```

## Listener for QR Event

```typescript
import qrcode from "qrcode-terminal";

export class QRListener extends Listener {
    constructor() {
        super({
            event: "qr"
        });
    }

    override async run(qr: string) {
        console.log("\n📱 Scan this QR code:");
        qrcode.generate(qr, { small: true });
    }
}
```

## Listener for Group Events

```typescript
import { GroupChat } from "whatsapp-web.js";

export class GroupJoinListener extends Listener {
    constructor() {
        super({
            event: "group_join",
        });
    }

    override async run(notification: any) {
        const chat = await notification.getChat();
        const contact = await notification.getContact();
        
        if (chat instanceof GroupChat) {
            await chat.sendMessage(
                `Welcome @${contact.id.user}! 👋`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Listener for Message Edit

```typescript
export class MessageEditListener extends Listener {
    constructor() {
        super({
            event: "message_edit"
        });
    }

    override async run(message: Message, newBody: string, prevBody: string) {
        console.log(`[Edit] ${message.from}:`);
        console.log(`  Old: ${prevBody}`);
        console.log(`  New: ${newBody}`);
    }
}
```

## Multiple Listeners

You can create multiple listeners for different events:

```typescript
import {
    ReadyListener,
    QRListener,
    MessageListener,
    GroupJoinListener,
    AuthFailureListener
} from "./listeners";

// Register all listeners
client.listenerStore.register(new ReadyListener());
client.listenerStore.register(new QRListener());
client.listenerStore.register(new MessageListener());
client.listenerStore.register(new GroupJoinListener());
client.listenerStore.register(new AuthFailureListener());

// Wire up listeners to WhatsApp client
for (const listener of client.listenerStore.values()) {
    client.on(listener.event, (...args: any[]) => listener.run(...args));
}
```

## Listener Store

Access and manage listeners:

```typescript
// Get listener by event
const messageListener = client.listenerStore.get("message");

// Get all listeners
const allListeners = Array.from(client.listenerStore.values());

// Check if listener exists
const hasMessageListener = client.listenerStore.has("message");

// Delete listener
client.listenerStore.delete("message");

// Clear all listeners
client.listenerStore.clear();
```

## Complete Example: Logging System

```typescript
import { Listener } from "@galihz/pman";
import type { Message, GroupChat } from "whatsapp-web.js";

export class LoggingListener extends Listener {
    constructor() {
        super({
            event: "message_create"
        });
    }

    override async run(message: Message) {
        if (message.fromMe) return;

        const chat = await message.getChat();
        const contact = await message.getContact();

        if (chat instanceof GroupChat) {
            console.log(`[GROUP] ${chat.name} | ${contact.pushname}: ${message.body}`);
        } else {
            console.log(`[PRIVATE] ${contact.pushname} (${contact.number}): ${message.body}`);
        }
    }
}
```

## Complete Example: Anti-Link System

```typescript
import { Listener } from "@galihz/pman";
import type { Message, GroupChat, GroupParticipant } from "whatsapp-web.js";

export class AntiLinkListener extends Listener {
    private blockedDomains = ["t.me", "wa.me", "chat.whatsapp.com"];

    constructor() {
        super({
            event: "message_create"
        });
    }

    override async run(message: Message) {
        if (message.fromMe) return;

        const chat = await message.getChat();
        if (!(chat instanceof GroupChat)) return;

        const participant = chat as any as GroupParticipant;
        const contact = await participant.getContact();
        const isAdmin = await participant.isAdmin();

        if (isAdmin) return;

        const body = message.body.toLowerCase();
        const containsLink = this.blockedDomains.some(domain => 
            body.includes(domain)
        );

        if (containsLink) {
            await message.delete(true);
            await chat.sendMessage(
                `⚠️ Link blocked. @${contact.id.user}, don't send links!`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Best Practices

1. **Filter carefully**: Avoid infinite loops (check `message.fromMe`)
2. **Performance**: Use async/await for I/O operations
3. **Error Handling**: Always wrap with try-catch
4. **Modular**: Separate complex logic into helper functions
