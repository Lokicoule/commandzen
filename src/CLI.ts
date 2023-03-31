import { ArgumentParser } from "./parsers/ArgumentParser";
import { CommandConfig, OptionConfig } from "./types";

/**
 * @class CLI
 * @description
 * The CLI class is the main entry point for the library.
 * It is used to register commands and options and parse the command line arguments.
 */
export class CLI {
  private commands: Map<string, CommandConfig>;
  private defaultCommand: CommandConfig;
  private parser: ArgumentParser;

  constructor() {
    this.commands = new Map<string, CommandConfig>();
    this.defaultCommand = {
      name: "default",
      options: [],
    };
    this.parser = new ArgumentParser(this.commands, this.defaultCommand);
  }

  public registerCommand(commandConfig: CommandConfig): void {
    this.commands.set(commandConfig.name, commandConfig);
    if (commandConfig.aliases) {
      commandConfig.aliases.forEach((alias) => {
        this.commands.set(alias, commandConfig);
      });
    }
  }

  public registerDefaultOptions(options: OptionConfig[]): void {
    this.defaultCommand.options = options;
  }

  public parse(args: string[]): Map<string, any> {
    try {
      return this.parser.parse(args);
    } catch (error) {
      this.displayHelp();
      throw error;
    }
  }

  public displayHelp(): void {
    console.log("Usage: cli [command] [options]");
    console.log("");
    console.log("Available commands:");
    this.commands.forEach((commandConfig) => {
      console.log(`  ${commandConfig.name}`);
      if (commandConfig.options) {
        console.log("    Options:");
        commandConfig.options.forEach((optionConfig) => {
          const optionStr = [
            optionConfig.shortName,
            optionConfig.longName,
            optionConfig.argument?.required
              ? `<${optionConfig.argument.type}>`
              : `[${optionConfig.argument?.type}]`,
          ]
            .filter(Boolean)
            .join(", ");
          console.log(`      ${optionStr}`);
        });
      }
    });
  }
}
