import { Command } from "./Command";

/**
 * @interface ArgvCommand
 * @description
 * The command arguments and options.
 */
export interface ArgvCommand {
  args: string[];
  options: Record<string, string | boolean>;
}

/**
 * @class CommandRunner
 * @description
 * Runs a command.
 */
export class CommandRunner {
  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * @method run
   * @param {Command} command
   * @param {ArgvCommand} argv
   * @returns {void}
   * @description
   * Runs the command.
   */
  public static run(command: Command, argv: ArgvCommand): void {
    if (argv.options.help) {
      command.help();
      process.exit(0);
    }

    command.emit(command.name, argv);
  }
}
