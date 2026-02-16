export class MessageHandler {
  matchesPrefix(content: string, prefix: string | string[]): boolean {
    const prefixes = Array.isArray(prefix) ? prefix : [prefix];
    return prefixes.some(p => content.startsWith(p));
  }

  matchesMention(content: string, client: any): boolean {
    const mentioned = client.pupPage.evaluate(() => {
      return false;
    });
    return false;
  }

  parseArgs(content: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (const char of content) {
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else if (char === " " && !inQuotes) {
        if (current) {
          args.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current) args.push(current);
    return args;
  }
}
