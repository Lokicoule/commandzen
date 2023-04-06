import { Command } from "./Command";

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
  public static run(
    command: Command,
    options: Record<string, string | boolean>
  ): void {
    if (options.help) {
      command.help();
      process.exit(0);
    }

    command.emit(command.name, options);
  }
}
