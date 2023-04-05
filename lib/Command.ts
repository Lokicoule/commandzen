import { EventEmitter } from "events";
import { Option } from "./Option";

export type CommandProps = {
  name: string;
  description: string;
};

export type CommandState = CommandProps & {
  aliases: string[];
  options: Option[];
  subcommands: Map<string, Command>;
};

export class Command extends EventEmitter {
  private readonly state: CommandState;

  constructor({ name, description }: CommandProps) {
    super();
    this.state = {
      name,
      description,
      aliases: [],
      options: [],
      subcommands: new Map<string, Command>(),
    };
  }

  /**
   * @method create
   * @param {CommandProps} props
   * @returns {Command}
   * @description Creates a new command
   * @static
   */
  public static create(props: CommandProps): Command {
    return new Command(props);
  }

  /**
   * @method addSubcommand
   * @param {Command} command
   * @returns {Command}
   * @description Adds a subcommand to the command
   */
  public addSubcommand(command: Command): Command {
    this.state.subcommands.set(command.name, command);
    command.aliases.forEach((alias) => this.subcommands.set(alias, command));
    return this;
  }

  /**
   * @method addOption
   * @param {Option} option
   * @returns {Command}
   * @description Adds an option to the command
   */
  public addOption(option: Option): Command {
    this.options.push(option);
    return this;
  }

  /**
   * @method findOption
   * @param {string} flag
   * @returns {Option | undefined}
   * @description Finds an option by its flag
   */
  public findOption(flag: string): Option | undefined {
    return this.options.find(
      (o) => o.shortName === flag || o.longName === flag
    );
  }

  /**
   * @method help
   * @returns {void}
   * @description Prints the help message for the command
   */
  public help(): void {
    console.info(`Usage: ${this.name} [options]`);
    console.info(`\t${this.description}`);
    console.info(`\nOptions:`);
    this.options.forEach((option) => {
      console.info(`\t${option.flag}\t\t${option.description}`);
    });
    console.info(`\nSubcommands:`);
    this.subcommands.forEach((command) => {
      console.info(`\t${command.name}\t\t${command.description}`);
    });

    process.exit(0);
  }

  public registerAction(callback: (argv: string[]) => void): Command {
    this.on(this.name, callback);
    return this;
  }

  public get name(): string {
    return this.state.name;
  }

  public set name(name: string) {
    this.state.name = name;
  }

  public get description(): string {
    return this.state.description;
  }

  public set description(description: string) {
    this.state.description = description;
  }

  public get aliases(): string[] {
    return this.state.aliases;
  }

  public set aliases(aliases: string[]) {
    this.state.aliases = aliases;
  }

  public get options(): Option[] {
    return this.state.options;
  }

  public set options(options: Option[]) {
    this.state.options = options;
  }

  public get subcommands(): Map<string, Command> {
    return this.state.subcommands;
  }
}
