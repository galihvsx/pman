import { Plugin } from "../structures/Plugin";

import { PmanClient } from "../PmanClient";

export class PluginStore {
  private plugins = new Map<string, Plugin>();
  public client: PmanClient;

  constructor(client: PmanClient) {
    this.client = client;
  }

  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  values(): IterableIterator<Plugin> {
    return this.plugins.values();
  }
}
