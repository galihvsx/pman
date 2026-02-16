import { PmanClient } from "../PmanClient";

export class Plugin {
  public name: string = "plugin";
  public version: string = "1.0.0";
  public description?: string;

  onLoad?(client: PmanClient): void;
  onUnload?(): void;
}
