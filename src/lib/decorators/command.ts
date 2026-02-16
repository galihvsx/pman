import "reflect-metadata";
import { Command } from "../structures/Command";
import type { CommandOptions } from "../structures/Command";

export function command(options: CommandOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    class DecoratedCommand extends Command {
      constructor() {
        super(options);
      }
      
      override run(context: any) {
        return originalMethod.call(this, context);
      }
    }
    
    Reflect.defineMetadata(`command:${options.name}`, new DecoratedCommand(), target);
    
    return descriptor;
  };
}
