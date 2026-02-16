import { Command } from "../structures/Command";

export class CommandStore {
  private commands = new Map<string, Command>();

  register(command: Command): void {
    this.commands.set(command.name, command);
    
    for (const alias of command.options.aliases) {
      this.commands.set(alias, command);
    }
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  values(): IterableIterator<Command> {
    return this.commands.values();
  }
}
