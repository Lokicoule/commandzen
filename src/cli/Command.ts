import { CommandConfig } from "src/config/CommandConfig";
import { OptionConfig } from "src/config/OptionConfig";
import { CLI } from "./CLI";

/**
 * @class Command
 * @description
 * The Command class is used to register commands and options and parse the command line arguments.
 * It is a wrapper around the CLI class.
 * It is recommended to use this class instead of the CLI class.
 * The CLI class is exported for advanced use cases.
 * The Command class is used to register commands and options and parse the command line arguments.
 */
export class Command {
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

  public parse(args: string[] = process.argv.slice(2)): Map<string, any> {
    return this.cli.parse(args);
  }
}
