import { CLI } from "../CLI";
import { CommandConfig, OptionConfig } from "../types";

/**
 * @class Commandify
 * @description
 * The Commandify class is used to register commands and options and parse the command line arguments.
 * It is a wrapper around the CLI class.
 * It is recommended to use this class instead of the CLI class.
 * The CLI class is exported for advanced use cases.
 * The Commandify class is used to register commands and options and parse the command line arguments.
 */
export class Commandify {
  private cli: CLI;

  constructor() {
    this.cli = new CLI();
  }

  public registerCommand(commandConfig: CommandConfig): void {
    this.cli.registerCommand(commandConfig);
  }

  public registerDefaultOptions(options: OptionConfig[]): void {
    this.cli.registerDefaultOptions(options);
  }

  public parse(): Map<string, any> {
    const args = process.argv.slice(2);
    return this.cli.parse(args);
  }
}
