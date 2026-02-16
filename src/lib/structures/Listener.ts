export interface ListenerOptions {
  event: string;
  name?: string;
}

export class Listener {
  public event: string;
  public name: string;

  constructor(options: ListenerOptions) {
    this.event = options.event;
    this.name = options.name ?? options.event;
  }

  run(...args: any[]): Promise<any> | any {
    throw new Error("Not implemented");
  }
}
