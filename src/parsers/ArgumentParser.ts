import { CommandConfig, OptionConfig } from "src/types";
import { OptionParser } from "./OptionParser";

/**
 * @class ArgumentParser
 * @description
 * The ArgumentParser class is used to parse the command line arguments.
 * The command line arguments are parsed and returned as a map.
 * The map contains the name of the command as the key and the options as the value.
 * The options are also returned as a map, where the key is the name of the option and the value is the value of the option.
 * If the command line arguments do not contain a command, the default command is used.
 * If the command line arguments contain an unknown command, an error is thrown.
 * If the command line arguments contain an option that is not defined for the command, an error is thrown.
 */
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

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (!currentCommand) {
        currentCommand =
          this.commands.get(arg) ||
          (arg.startsWith("-") ? this.defaultCommand : undefined);
        if (currentCommand) {
          result.set(currentCommand.name, {});
        } else {
          throw new Error(`Unknown command: ${arg}`);
        }
      }

      if (arg.startsWith("-")) {
        const option = this.findOptionByShortName(currentCommand, arg);
        if (option) {
          const parsedOption = OptionParser.parse(option, args, i);
          result.get(currentCommand.name)[option.longName || option.shortName] =
            parsedOption.value;
          i = parsedOption.index;
        } else {
          throw new Error(`Unknown option: ${arg}`);
        }
      }
    }

    return result;
  }

  private findOptionByShortName(
    command: CommandConfig,
    shortName: string
  ): OptionConfig | undefined {
    return command.options?.find((option) => option.shortName === shortName);
  }
}
