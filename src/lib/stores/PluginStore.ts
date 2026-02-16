import { Plugin } from "../structures/Plugin";

export class PluginStore {
  private plugins = new Map<string, Plugin>();

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
