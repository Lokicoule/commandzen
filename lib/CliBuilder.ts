import { Command, CommandProps } from "./Command";
import { Option, OptionProps } from "./Option";

type ParsedArgv = {
  command: string | null;
  args: string[];
  options: {
    [key: string]: string | boolean;
  };
};

export class CliBuilder {
  private defaultCommand: Command;

  constructor({ name, description }: CommandProps) {
    this.defaultCommand = new Command({ name, description });

    this.addHelpToDefaultCommand();
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
      new Option({
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
    const option = new Option(props);
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
    const parsedArgv: ParsedArgv = this.parseArgv(argv);
    let command: Command | undefined;

    if (parsedArgv.command) {
      command = this.defaultCommand.subcommands.get(parsedArgv.command);
    }

    if (!command) {
      command = this.defaultCommand;
    }

    if (parsedArgv.options.help) {
      command.help();
      process.exit(0);
    }

    command.emit(command.name, parsedArgv);
  }

  /**
   * @method parseArgv
   * @param {string[]} argv
   * @returns {ParsedArgv}
   * @description
   * Parses the arguments and returns an object with the command, arguments and options.
   */
  private parseArgv(argv: string[]): ParsedArgv {
    let command: string | null = null;
    const args: string[] = [];
    const options: {
      [key: string]: string | boolean;
    } = {};

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];

      if (i === 0 && !arg.startsWith("-")) {
        command = arg;
      } else {
        let option: Option | undefined = this.defaultCommand.findOption(arg);

        if (command) {
          const specificCommand = this.defaultCommand.subcommands.get(command);
          if (specificCommand) {
            option = option || specificCommand.findOption(arg);
          }
        }

        if (option) {
          const nextArg = argv[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            options[option.key] = nextArg;
            i++;
          } else {
            if (option.required) {
              console.error(
                `The option "${option.flag}" requires an argument, but it was not provided.`
              );
              process.exit(1);
            }
            options[option.key] = true;
          }
        } else {
          args.push(arg);
        }
      }
    }

    return { command, args, options };
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
      new Option({
        flag: "-h, --help",
        description: "Display help information",
      })
    );
  }
}
