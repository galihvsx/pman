# Plugins

Plugins memungkinkan Anda mengorganisir command dan listener ke dalam modul terpisah yang dapat di-load/di-unload secara dinamis.

## Plugin Structure

```typescript
import { PmanClient } from "pman";

export class Plugin {
    public name: string;
    public version: string;
    public description?: string;

    onLoad?(client: PmanClient): void;
    onUnload?(): void;
}
```

## Dasar Plugin

```typescript
import { Plugin, PmanClient } from "pman";

export class LoggingPlugin extends Plugin {
    override name = "logging";
    override version = "1.0.0";
    override description = "Plugin untuk logging pesan";

    override onLoad(client: PmanClient) {
        console.log(`[${this.name}] Plugin loaded v${this.version}`);
        
        // Registrasi commands/listeners dari plugin ini
        // client.commands.register(new LogCommand());
    }

    override onUnload() {
        console.log(`[${this.name}] Plugin unloaded`);
    }
}
```

## Plugin dengan Commands

```typescript
import { Plugin, PmanClient, Command, Listener } from "pman";
import type { CommandContext } from "pman";

export class UtilityPlugin extends Plugin {
    override name = "utility";
    override version = "1.0.0";

    override onLoad(client: PmanClient) {
        console.log(`[${this.name}] Loading utility commands...`);

        client.commands.register(new TimeCommand());
        client.commands.register(new DateCommand());
        client.commands.register(new WeatherCommand());
        
        console.log(`[${this.name}] Loaded 3 commands`);
    }

    override onUnload() {
        console.log(`[${this.name}] Utility commands unloaded`);
    }
}

class TimeCommand extends Command {
    constructor() {
        super({ name: "time", description: "Current time" });
    }

    override async run(context: CommandContext) {
        await context.reply(`⏰ ${new Date().toLocaleTimeString()}`);
    }
}

class DateCommand extends Command {
    constructor() {
        super({ name: "date", description: "Current date" });
    }

    override async run(context: CommandContext) {
        await context.reply(`📅 ${new Date().toLocaleDateString()}`);
    }
}
```

## Plugin dengan Listeners

```typescript
import { Plugin, PmanClient, Listener } from "pman";
import type { Message } from "whatsapp-web.js";

export class ModerationPlugin extends Plugin {
    override name = "moderation";
    override version = "1.0.0";

    private listeners: Listener[] = [];

    override onLoad(client: PmanClient) {
        console.log(`[${this.name}] Loading moderation listeners...`);

        const antiSpamListener = new AntiSpamListener();
        const antiLinkListener = new AntiLinkListener();

        this.listeners.push(antiSpamListener, antiLinkListener);
        
        // Register listeners
        for (const listener of this.listeners) {
            client.listenerStore.register(listener);
        }

        // Wire up listeners
        for (const listener of this.listeners) {
            client.on(listener.event, (...args: any[]) => listener.run(...args));
        }
    }

    override onUnload() {
        for (const listener of this.listeners) {
            client.off(listener.event);
        }
        console.log(`[${this.name}] Moderation listeners unloaded`);
    }
}

class AntiSpamListener extends Listener {
    constructor() {
        super({ event: "message_create" });
    }

    async run(message: Message) {
        if (message.fromMe) return;
        // Anti-spam logic
    }
}
```

## Plugin dengan Dependencies

```typescript
export class ModerationPlugin extends Plugin {
    override name = "moderation";
    override version = "1.0.0";
    override description = "Moderation tools for groups";

    private requiredPlugins = ["logging"];
    private enabled = false;

    override onLoad(client: PmanClient) {
        // Check required plugins
        const allPlugins = Array.from(client.plugins.keys());
        const missing = this.requiredPlugins.filter(
            p => !allPlugins.includes(p)
        );

        if (missing.length > 0) {
            console.warn(
                `[${this.name}] Required plugins missing: ${missing.join(", ")}`
            );
            return;
        }

        this.enabled = true;
        console.log(`[${this.name}] Plugin loaded successfully`);
    }

    isEnabled() {
        return this.enabled;
    }
}
```

## Plugin Store

Access dan manage plugins:

```typescript
// Get plugin by name
const loggingPlugin = client.plugins.get("logging");

// Get all plugins
const allPlugins = Array.from(client.plugins.values());

// Check if plugin exists
const hasLogging = client.plugins.has("logging");

// Delete/unload plugin
client.plugins.delete("logging");

// Clear all plugins
client.plugins.clear();
```

## Contoh Lengkap: Plugin Ecosystem

```typescript
import {
    PmanClient,
    Plugin,
    Command,
    Listener,
    MessageHandler
} from "pman";

const client = new PmanClient({
    prefix: ".",
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Plugin: Welcome Message
export class WelcomePlugin extends Plugin {
    override name = "welcome";
    override version = "1.0.0";

    override onLoad(client: PmanClient) {
        client.listenerStore.register(new WelcomeListener());
        client.commands.register(new WelcomeConfigCommand());
        console.log(`[${this.name}] Welcome messages enabled`);
    }
}

// Plugin: Anti-Delete
export class AntiDeletePlugin extends Plugin {
    override name = "antidelete";
    override version = "1.0.0";

    override onLoad(client: PmanClient) {
        client.listenerStore.register(new MessageRevokeListener());
        console.log(`[${this.name}] Anti-delete enabled`);
    }
}

// Plugin: Auto-Replies
export class AutoReplyPlugin extends Plugin {
    override name = "autoreply";
    override version = "1.0.0";

    override onLoad(client: PmanClient) {
        client.listenerStore.register(new AutoReplyListener());
        client.commands.register(new AddReplyCommand());
        client.commands.register(new RemoveReplyCommand());
        console.log(`[${this.name}] Auto-reply system enabled`);
    }
}

// Register semua plugins
client.plugins.register(new WelcomePlugin());
client.plugins.register(new AntiDeletePlugin());
client.plugins.register(new AutoReplyPlugin());

// Initialize
client.initialize();
```

## Tips Best Practices

1. **Single Responsibility**: Satu plugin untuk satu fitur
2. **Version Management**: Selalu update version saat ada perubahan
3. **Clean Unload**: Bersihkan listeners saat onUnload
4. **Dependencies**: Document required dependencies di plugin
5. **Configuration**: Support konfigurasi plugin jika kompleks
