import { Client, type ClientOptions } from "whatsapp-web.js";
import { CommandStore } from "./stores/CommandStore";
import { ListenerStore } from "./stores/ListenerStore";
import { PluginStore } from "./stores/PluginStore";

export interface PmanOptions extends ClientOptions {
    prefix?: string | string[];
    prefixEnabled?: boolean;
    mentionEnabled?: boolean;
}

export class PmanClient extends Client {
    public commands: CommandStore;
    public listenerStore: ListenerStore;
    public plugins: PluginStore;
    public pmanOptions: PmanOptions;

    constructor(options: PmanOptions = {}) {
        super(options);

        this.pmanOptions = {
            ...options,
            prefix: options.prefix ?? ["!"],
            prefixEnabled: options.prefixEnabled ?? true,
            mentionEnabled: options.mentionEnabled ?? false,
        };

        this.commands = new CommandStore();
        this.listenerStore = new ListenerStore();
        this.plugins = new PluginStore(this);
    }
}

