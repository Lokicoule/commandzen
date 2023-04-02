import { Command } from "../command/Command";
import { CommandParser } from "../command/CommandParser";
import { Option } from "../option/Option";

export class CLI {
  private commands: Map<string, Command>;
  private defaultCommand: Command;

  constructor() {
    this.commands = new Map<string, Command>();
    this.defaultCommand = new Command({
      name: "default",
    });
  }

  public registerDefaultOptions(options: Option[]): void {
    this.defaultCommand.options = options;
  }

  public registerCommand(command: Command): void {
    this.commands.set(command.name, command);
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands.set(alias, command);
      });
    }
  }

  public registerDefaultCommand(command: Command): void {
    this.defaultCommand = command;
  }

  public parse(args: string[]): void {
    let commandName = args[0];
    let command: Command | undefined;
    let remainingArgs = args.slice(1);

    if (commandName && !commandName.startsWith("-")) {
      command = this.commands.get(commandName);
    } else {
      command = this.defaultCommand;
      remainingArgs = args;
    }

    if (!command) {
      this.displayHelp();
      throw new Error(`Unknown command: ${commandName}`);
    }

    const options = CommandParser.parseOptions(command, remainingArgs);
    CommandParser.validateOptions(command, options);

    command.execute(options);
  }

  public displayHelp(): void {
    console.info(this.getHelp());
  }

  public getHelp(): string {
    let help = `Usage: cli [command] [options]\n\nAvailable commands:\n`;

    this.commands.forEach((command) => {
      help += command.getHelp();
    });

    return help;
  }
}
