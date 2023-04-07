import { Command, CommandParser, CommandProps, CommandRunner } from "./command";
import { Option, OptionProps } from "./option/Option";

/**
 * @class CliBuilder
 * @description
 * Used to build a CLI.
 */
export class CliBuilder {
  private defaultCommand: Command;

  private constructor({ name, description }: CommandProps) {
    this.defaultCommand = Command.create({ name, description });

    this.addHelpToDefaultCommand();
  }

  /**
   * @method create
   * @param {CommandProps} props
   * @returns {CliBuilder}
   * @description
   * Creates a new CLI builder.
   * @static
   */
  public static create(props: CommandProps): CliBuilder {
    return new CliBuilder(props);
  }

  /**
   * @method addCommand
   * @param {Command} command
   * @returns {CliBuilder}
   * @description
   * Adds a command to the CLI.
   */
  public addCommand(command: Command): CliBuilder {
    command.addOption({
      flag: "-h, --help",
      description: "Display help information for this command.",
    });
    this.defaultCommand.addSubcommand(command);
    return this;
  }

  /**
   * @method addOption
   * @param {OptionProps} props
   * @returns {CliBuilder}
   * @description
   * Adds an option to the default command.
   */
  public addOption(props: OptionProps): CliBuilder {
    this.defaultCommand.addOption(props);
    return this;
  }

  /**
   * @method addGlobalOption
   * @param {OptionProps} props
   * @returns {CliBuilder}
   * @description
   * Adds an option to all commands.
   */
  public addGlobalOption(props: OptionProps): CliBuilder {
    const addOptionToCommand = (command: Command) => {
      command.addOption(props);
      command.subcommands.forEach((subcommand) => {
        addOptionToCommand(subcommand);
      });
    };

    addOptionToCommand(this.defaultCommand);

    return this;
  }

  /**
   * @method setDefaultCommand
   * @param {Command} command
   * @returns {CliBuilder}
   * @description
   * Overrides the default command.
   */
  public setDefaultCommand(command: Command): CliBuilder {
    this.defaultCommand = command;
    this.addHelpToDefaultCommand();
    return this;
  }

  /**
   * @method parse
   * @param {string[]} argv
   * @returns {void}
   * @description
   * Parses the arguments and executes the command.
   */
  public parse(argv: string[] = process.argv.slice(2)): void {
    const commandList = CommandParser.parse(this.defaultCommand, argv);
    this.runCommands(commandList);
  }

  /**
   * @method runCommands
   * @param {Array<{ command: Command; args: string[]; options: Record<string, string | boolean> }>} commandList
   * @returns {void}
   * @description
   * Runs the commands.
   */
  private runCommands(
    commandList: Array<{
      command: Command;

      options: Record<string, string | boolean>;
    }>
  ): void {
    for (const { command, options } of commandList) {
      CommandRunner.run(command, options);
    }
  }

  /**
   * @method addHelpToDefaultCommand
   * @returns {void}
   * @description
   * Adds the help command and option to the default command.
   * This is called when the default command is set or when a command is added.
   */
  private addHelpToDefaultCommand(): void {
    this.addHelpOptionToCommand(this.defaultCommand);

    const helpCommand = this.createCommandHelp();
    this.defaultCommand.addSubcommand(helpCommand);
  }

  /**
   * @method addHelpOptionToCommand
   * @param {Command} command
   * @returns {void}
   * @description
   * Adds the help option to a command.
   */
  private addHelpOptionToCommand(command: Command): void {
    command.addOption({
      flag: "-h, --help",
      description: "Display help information",
    });
  }

  /**
   * @method createCommandHelp
   * @returns {Command}
   * @description
   * Creates the help command.
   */
  private createCommandHelp(): Command {
    return Command.create({
      name: "help",
      description: "Display help information",
      options: [
        Option.create({
          flag: "-c, --command <command>",
          description: "Display help information for a specific command",
        }),
      ],
    }).registerAction<{
      command?: string;
    }>(({ command }) => {
      if (command) {
        const subcommand = this.defaultCommand.findSubcommand(command);
        if (subcommand) {
          subcommand.help();
        } else {
          console.warn(`Command '${command}' not found.`);
        }
      } else {
        this.defaultCommand.help();
      }
    });
  }
}
