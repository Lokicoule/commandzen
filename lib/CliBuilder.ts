import { ActionProps, Command, CommandProps } from "./Command";
import { Option, OptionProps } from "./Option";

type ParsedArgv = ActionProps<{ help?: boolean }> & {
  command: string;
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
    const initialResult = {
      command: this.defaultCommand.name,
      args: new Array<string>(),
      options: {} as Record<string, string | boolean>,
      optionExpected: false,
      commandProcessed: false,
    };

    const { command, args, options } = argv.reduce((acc, arg, i, arr) => {
      if (!acc.commandProcessed && !arg.startsWith("-")) {
        acc.command = arg;
        acc.commandProcessed = true;
      } else {
        let option = this.defaultCommand.findOption(arg);

        if (acc.command) {
          const specificCommand = this.defaultCommand.subcommands.get(
            acc.command
          );
          if (specificCommand) {
            option = option || specificCommand.findOption(arg);
          }
        }

        if (option) {
          const nextArg = arr[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            acc.options[option.key] = nextArg;
            acc.optionExpected = true;
          } else {
            if (option.required) {
              console.error(
                `The option "${option.flag}" requires an argument, but it was not provided.`
              );
              process.exit(1);
            }
            acc.options[option.key] = true;
          }
        } else if (!acc.optionExpected) {
          acc.args.push(arg);
        } else {
          acc.optionExpected = false;
        }
      }
      return acc;
    }, initialResult);

    return { command, args, options };
  }
}
