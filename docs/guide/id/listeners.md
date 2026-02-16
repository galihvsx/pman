# Listeners

Listeners memungkinkan bot merespon ke berbagai event WhatsApp yang terjadi, bukan hanya command dari user.

## Listener Options

```typescript
interface ListenerOptions {
    event: string;      // Nama event WhatsApp
    name?: string;      // Nama listener (opsional, default=event)
}
```

## Event WhatsApp yang Tersedia

List event dari whatsapp-web.js:

| Event | Deskripsi |
|-------|-----------|
| `ready` | Client siap digunakan |
| `qr` | QR code tersedia untuk scan |
| `authenticated` | Berhasil autentikasi |
| `auth_failure` | Gagal autentikasi |
| `message_create` | Pesan dibuat (termasuk dari bot) |
| `message` | Pesan diterima |
| `message_ciphertext` | Pesan terenkripsi diterima |
| `message_ack` | Acknowledgment pesan |
| `message_edit` | Pesan diedit |
| `message_revoke_everyone` | Pesan dihapus untuk semua |
| `message_revoke_me` | Pesan dihapus untuk pengirim |
| `media_uploaded` | Media diupload |
| `chat_new` | Chat baru dibuat |
| `chat_archived` | Chat diarsipkan |
| `contact_added` | Kontak ditambahkan |
| `contact_changed` | Kontak berubah |
| `group_join` | User join group |
| `group_leave` | User leave group |
| `group_admin_changed` | Admin group berubah |
| `state_change` | State client berubah |

## Listener Dasar

```typescript
import { Listener } from "pman";
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

## Listener untuk Event Ready

```typescript
export class ReadyListener extends Listener {
    constructor() {
        super({
            event: "ready"
        });
    }

    override async run() {
        console.log("✅ Bot ready dan online!");
        console.log(`📊 Jumlah command: ${Array.from(client.commands.values()).length}`);
    }
}
```

## Listener untuk Event QR

```typescript
import qrcode from "qrcode-terminal";

export class QRListener extends Listener {
    constructor() {
        super({
            event: "qr"
        });
    }

    override async run(qr: string) {
        console.log("\n📱 Scan QR code ini:");
        qrcode.generate(qr, { small: true });
    }
}
```

## Listener untuk Event Group

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
                `Selamat datang @${contact.id.user}! 👋`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Listener untuk Event Message Edit

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

Anda bisa membuat banyak listeners untuk event yang berbeda:

```typescript
import {
    ReadyListener,
    QRListener,
    MessageListener,
    GroupJoinListener,
    AuthFailureListener
} from "./listeners";

// Register semua listeners
client.listenerStore.register(new ReadyListener());
client.listenerStore.register(new QRListener());
client.listenerStore.register(new MessageListener());
client.listenerStore.register(new GroupJoinListener());
client.listenerStore.register(new AuthFailureListener());

// Wire up listeners ke WhatsApp client
for (const listener of client.listenerStore.values()) {
    client.on(listener.event, (...args: any[]) => listener.run(...args));
}
```

## Listener Store

Access dan manage listeners:

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

## Contoh Lengkap: Logging System

```typescript
import { Listener } from "pman";
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

## Contoh Lengkap: Anti-Link System

```typescript
import { Listener } from "pman";
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
                `⚠️ Link diblokir. @${contact.id.user}, jangan kirim link!`,
                { mentions: [contact] }
            );
        }
    }
}
```

## Tips Best Practices

1. **Filter dengan hati-hati**: Hindari infinite loop (cek `message.fromMe`)
2. **Performance**: Gunakan async/await untuk operasi I/O
3. **Error Handling**: Selalu wrap dengan try-catch
4. **Modular**: Separahkan logic ke helper function jika kompleks
