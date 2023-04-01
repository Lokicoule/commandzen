import { CommandConfig } from "../config/CommandConfig";
import { OptionParser } from "../option/OptionParser";

export class ArgumentParser {
  private commands: Map<string, CommandConfig>;
  private defaultCommand: CommandConfig;

  constructor(
    commands: Map<string, CommandConfig>,
    defaultCommand: CommandConfig
  ) {
    this.commands = commands;
    this.defaultCommand = defaultCommand;
  }

  public parse(args: string[]): Map<string, any> {
    const result = new Map<string, any>();
    let currentCommand: CommandConfig | undefined;

    args.forEach((arg, i) => {
      if (!currentCommand) {
        currentCommand = this.getCommand(arg);
        if (currentCommand) {
          result.set(currentCommand.name, {});
        } else {
          throw new Error(`Unknown command: ${arg}`);
        }
      }

      if (arg.startsWith("-")) {
        const option = currentCommand.findOption(arg);
        if (!option) {
          throw new Error(`Unknown option: ${arg}`);
        }

        const parsedOption = OptionParser.parse(option, args, i);
        const optionKey = option.getKey();
        result.get(currentCommand.name)[optionKey] = parsedOption.value;
        i = parsedOption.index;
      }
    });

    return result;
  }

  private getCommand(arg: string): CommandConfig | undefined {
    return (
      this.commands.get(arg) ||
      (arg.startsWith("-") ? this.defaultCommand : undefined)
    );
  }
}
