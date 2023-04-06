import { Command } from "./Command";

type CommandResult = {
  command: Command;
  args: Record<string, string | undefined>;
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
      args: {},
      options: {},
    };

    const commandList = argv.reduce<{ acc: CommandResult[]; offset: number }>(
      (state, arg, index, arr) => {
        const nextState: {
          acc: CommandResult[];
          offset: number;
        } = { ...state, offset: state.offset - 1 };
        if (nextState.offset > 0) {
          return nextState;
        }

        if (!arg.startsWith("-")) {
          return this.handleSubcommand(arg, nextState.acc);
        } else {
          return this.handleOption(arg, nextState.acc, arr, index);
        }
      },
      { acc: [initialState], offset: 0 }
    ).acc;

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
  ): { acc: CommandResult[]; offset: number } {
    const currentCommandResult = commandList[commandList.length - 1];
    const subcommand = currentCommandResult.command.findSubcommand(arg);

    if (subcommand) {
      commandList.push({
        command: subcommand,
        args: {},
        options: {},
      });
    } else {
      currentCommandResult.args[currentCommandResult.command.args.shift().key] =
        arg;
    }

    return { acc: commandList, offset: 0 };
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
  ): { acc: CommandResult[]; offset: number } {
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
    }

    return { acc: commandList, offset: 2 };
  }
}
