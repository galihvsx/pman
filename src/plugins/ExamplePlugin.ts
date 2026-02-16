import { Plugin } from "../lib/structures/Plugin";
import { PmanClient } from "../lib/PmanClient";

export class ExamplePlugin extends Plugin {
  name = "example";
  version = "1.0.0";
  description = "Example plugin with ping command";

  onLoad(client: PmanClient): void {
    console.log(`Loaded ${this.name} plugin`);
  }

  onUnload(): void {
    console.log(`Unloaded ${this.name} plugin`);
  }
}
