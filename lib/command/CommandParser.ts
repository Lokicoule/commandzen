import { OptionParser } from "../option/OptionParser";
import { Command } from "./Command";

export class CommandParser {
  public static parseOptions(
    command: Command,
    args: string[]
  ): Record<string, any> {
    const options: Record<string, any> = {};

    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        console.log(arg);
        const option = command.findOption(arg);
        if (!option) {
          throw new Error(`Unknown option: ${arg}`);
        }

        const { value, index } = OptionParser.parse(option, args, i);
        const optionKey = option.getKey();
        options[optionKey] = value;
        i = index + 1;
      } else {
        i++;
      }
    }

    return options;
  }

  public static validateOptions(
    command: Command,
    options: Record<string, any>
  ): void {
    console.log(JSON.stringify(command, null, 2));
    console.log(JSON.stringify(options, null, 2));
    const optionKeys = command.options.map((option) => option.getKey());
    console.log(optionKeys);
    for (const key in options) {
      console.log(key);
      if (!optionKeys.includes(key)) {
        throw new Error(`Unknown option: ${key}`);
      }
      console.log(JSON.stringify(command.options, null, 2));
      const option = command.findOption(key);
      console.log(option);
      if (option?.argument?.required && options[key] === undefined) {
        throw new Error(`Missing required option: ${option.longName}`);
      }
    }
  }
}
