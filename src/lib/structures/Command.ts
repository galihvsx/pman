import { Message } from "whatsapp-web.js";

export interface CommandOptions {
  name: string;
  description?: string;
  prefix?: string | string[];
  prefixEnabled?: boolean;
  mentionEnabled?: boolean;
  aliases?: string[];
}

export interface CommandContext {
  message: Message;
  args: string[];
  reply: (content: string) => Promise<Message>;
  client: any;
}

export class Command {
  public name: string;
  public description?: string;
  public options: Omit<Required<CommandOptions>, "name" | "description">;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.options = {
      prefix: options.prefix ?? ["!"],
      prefixEnabled: options.prefixEnabled ?? true,
      mentionEnabled: options.mentionEnabled ?? false,
      aliases: options.aliases ?? [],
    };
  }

  run(context: CommandContext): Promise<any> | any {
    throw new Error("Not implemented");
  }
}
