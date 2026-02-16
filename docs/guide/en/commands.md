# Commands

Commands are the core of bot interaction. With p-man, you can create commands in two ways: class-based or decorator-based.

## Command Context

Each command receives a context object:

```typescript
interface CommandContext {
    message: Message;
    args: string[];
    reply: (content: string) => Promise<Message>;
    client: PmanClient;
}
```

## Class-Based Commands

The traditional way to create commands by extending the `Command` class.

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

### Basic Example

```typescript
import { Command, type CommandContext } from "@galihz/pman";

export class PingCommand extends Command {
    constructor() {
        super({
            name: "ping",
            description: "Check bot connection",
        });
    }

    override async run(context: CommandContext) {
        await context.reply("Pong!");
    }
}
```

### Command with Aliases

```typescript
export class HelpCommand extends Command {
    constructor() {
        super({
            name: "help",
            description: "Show help",
            aliases: ["h", "assist"],
        });
    }

    override async run(context: CommandContext) {
        const helpText = `
📋 Commands List:
• !ping - Check connection
• !help - This help
        `;
        await context.reply(helpText.trim());
    }
}
```

### Command with Arguments

```typescript
export class SayCommand extends Command {
    constructor() {
        super({
            name: "say",
            description: "Repeat a message",
        });
    }

    override async run(context: CommandContext) {
        const message = context.args.join(" ");
        if (!message) {
            return await context.reply("Write something after !say");
        }
        await context.reply(message);
    }
}
```

### Command with Custom Prefix

```typescript
export class AdminCommand extends Command {
    constructor() {
        super({
            name: "ban",
            description: "Ban user",
            prefix: "#",     // Use # prefix
            prefixEnabled: true,    // Enable prefix check
        });
    }

    override async run(context: CommandContext) {
        const userId = context.args[0];
        await context.reply(`User ${userId} banned!`);
    }
}
```

## Decorator-Based Commands

Using decorators for cleaner command creation. Requires `experimentalDecorators` in tsconfig.json.

```typescript
import { command, Command } from "@galihz/pman";
import type { CommandOptions } from "@galihz/pman";

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

## Complete Example: Command Registration

```typescript
import { PingCommand, HelpCommand, SayCommand } from "./commands";

// Register multiple commands
client.commands.register(new PingCommand());
client.commands.register(new HelpCommand());
client.commands.register(new SayCommand());
```

## Command Store

Commands are stored in the `CommandStore`:

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

## Best Practices

1. **Error Handling**: Always wrap command logic in try-catch
2. **Validation**: Validate args before processing
3. **Type Safety**: Use TypeScript for args validation
4. **Modular**: One command per file

## Error Handling Example

```typescript
export class DiceCommand extends Command {
    constructor() {
        super({
            name: "dice",
            description: "Roll a die",
        });
    }

    override async run(context: CommandContext) {
        try {
            const sides = parseInt(context.args[0]) || 6;
            if (sides < 2 || sides > 1000) {
                return await context.reply("Sides must be between 2-1000");
            }
            const result = Math.floor(Math.random() * sides) + 1;
            await context.reply(`🎲 ${result}/6`);
        } catch (error) {
            console.error(error);
            await context.reply("An error occurred while rolling the die");
        }
    }
}
```
