import { Command } from "./Command";

type CommandResult = {
  command: Command;
  args: string[];
  options: Record<string, string | boolean>;
};

/**
 * @class CommandParser
 * @description
 * Parses the arguments and returns a list of commands.
 */
export class CommandParser {
  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * @method parse
   * @param {Command} command
   * @param {string[]} argv
   * @returns {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>}
   * @description
   * Parses the arguments and returns a list of commands.
   */
  public static parse(command: Command, argv: string[]): Array<CommandResult> {
    const initialState: CommandResult = {
      command,
      args: [],
      options: {},
    };

    const commandList = argv.reduce<Array<CommandResult>>(
      (acc, arg, index, arr) => {
        if (!arg.startsWith("-")) {
          return this.handleSubcommand(arg, acc);
        } else {
          return this.handleOption(arg, acc, arr, index);
        }
      },
      [initialState]
    );

    return commandList;
  }

  /**
   * @method handleSubcommand
   * @param {string} arg
   * @param {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>} commandList
   * @returns {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>}
   * @description
   * Handles a subcommand.
   */
  private static handleSubcommand(
    arg: string,
    commandList: CommandResult[]
  ): CommandResult[] {
    const currentCommandResult = commandList[commandList.length - 1];
    const subcommand = currentCommandResult.command.subcommands.get(arg);

    if (subcommand) {
      commandList.push({
        command: subcommand,
        args: [],
        options: {},
      });
    } else {
      currentCommandResult.args.push(arg);
    }

    return commandList;
  }

  /**
   * @method handleOption
   * @param {string} arg
   * @param {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>} commandList
   * @param {string[]} argv
   * @param {number} index
   * @returns {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>}
   * @description
   * Handles an option.
   */
  private static handleOption(
    arg: string,
    commandList: CommandResult[],
    argv: string[],
    index: number
  ): CommandResult[] {
    const currentCommandResult = commandList[commandList.length - 1];
    const option = currentCommandResult.command.findOption(arg);

    if (option) {
      const nextArg = argv[index + 1];
      if (nextArg && !nextArg.startsWith("-")) {
        currentCommandResult.options[option.key] = nextArg;
      } else {
        if (option.required) {
          console.error(
            `The option "${option.flag}" requires an argument, but it was not provided.`
          );
          process.exit(1);
        }
        currentCommandResult.options[option.key] = true;
      }
    } else {
      currentCommandResult.args.push(arg);
    }

    return commandList;
  }
}
