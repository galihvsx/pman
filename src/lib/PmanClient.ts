import { Client, ClientOptions } from "whatsapp-web.js";
import { CommandStore } from "./stores/CommandStore";
import { ListenerStore } from "./stores/ListenerStore";
import { PluginStore } from "./stores/PluginStore";

export interface PmanOptions {
  prefix?: string | string[];
  prefixEnabled?: boolean;
  mentionEnabled?: boolean;
}

export class PmanClient extends Client {
  public commands: CommandStore;
  public listeners: ListenerStore;
  public plugins: PluginStore;
  public options: PmanOptions;

  constructor(options: ClientOptions & PmanOptions = {}) {
    super(options);
    
    this.options = {
      prefix: options.prefix ?? ["!"],
      prefixEnabled: options.prefixEnabled ?? true,
      mentionEnabled: options.mentionEnabled ?? false,
    };
    
    this.commands = new CommandStore();
    this.listeners = new ListenerStore();
    this.plugins = new PluginStore(this);
  }
}
