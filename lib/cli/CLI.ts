import { Command } from "../command/Command";
import { CommandParser, ParsedOptions } from "../command/CommandParser";
import { Option } from "../option/Option";

export class CLI {
  private commands: Map<string, Command<unknown>>;
  private defaultCommand: Command<unknown>;

  constructor() {
    this.commands = new Map<string, Command<unknown>>();
    this.defaultCommand = new Command({
      name: "default",
    });
  }

  public registerDefaultOptions(options: Option[]): CLI {
    this.defaultCommand.options = options;

    return this;
  }

  public registerCommand<T = ParsedOptions>(command: Command<T>): CLI {
    this.commands.set(command.name, command);
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands.set(alias, command);
      });
    }

    return this;
  }

  public registerDefaultCommand<T = ParsedOptions>(command: Command<T>): CLI {
    this.defaultCommand = command;
    return this;
  }

  public registerHelpCommand(): CLI {
    const helpCommand = new Command({
      name: "help",
      description: "Display help",
      action: () => {
        this.displayHelp();
      },
    });

    this.registerCommand(helpCommand);

    return this;
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
