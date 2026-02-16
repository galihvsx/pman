import { Listener } from "../structures/Listener";

export class ListenerStore {
  private listeners = new Map<string, Listener>();

  register(listener: Listener): void {
    this.listeners.set(listener.name, listener);
  }

  get(name: string): Listener | undefined {
    return this.listeners.get(name);
  }

  values(): IterableIterator<Listener> {
    return this.listeners.values();
  }
}
