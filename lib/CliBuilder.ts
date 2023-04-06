import { Command, CommandParser, CommandProps, CommandRunner } from "./command";
import { Option, OptionProps } from "./option/Option";

type CommandArgs = Record<string, string | undefined>;
type CommandOptions = Record<string, string | boolean>;

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
    command.addOption(
      Option.create({
        flag: "-h, --help",
        description: "Display help information for this command.",
      })
    );
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
    const option = Option.create(props);
    this.defaultCommand.addOption(option);
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
   * @method addHelpToDefaultCommand
   * @returns {void}
   * @description
   * Adds the help command and option to the default command.
   * This is called when the default command is set or when a command is added.
   */
  private addHelpToDefaultCommand(): void {
    this.defaultCommand.addOption(
      Option.create({
        flag: "-h, --help",
        description: "Display help information",
      })
    );
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
      args: CommandArgs;
      options: CommandOptions;
    }>
  ): void {
    for (const { command, args, options } of commandList) {
      for (const arg of command.args) {
        // check if default value is set
        if (arg.defaultValue !== undefined) {
          args[arg.key] =
            args[arg.key] ?? (arg.defaultValue as string | undefined);
        } else if (arg.required) {
          // check if required
          if (args[arg.key] === undefined) {
            console.info(
              `Missing required argument for command: ${command.name}`
            );
            command.help();
            process.exit(1);
          }
        }
      }

      CommandRunner.run(command, {
        args,
        options,
      });
    }
  }
}
