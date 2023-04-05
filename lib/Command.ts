import { EventEmitter } from "events";
import { Option } from "./Option";

/**
 * @type CommandProps
 * @description
 * Represents the properties of a command.
 * @property {string} name
 * @property {string} description
 */
export type CommandProps = {
  name: string;
  description: string;
};

type CommandState = CommandProps & {
  aliases: string[];
  options: Option[];
  subcommands: Map<string, Command>;
};

/**
 * @class Command
 * @description Represents a command
 * @extends EventEmitter
 */
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
      (o) =>
        o.shortName === flag ||
        o.longName === flag ||
        o.shortName === `-${flag}` ||
        o.longName === `--${flag}`
    );
  }

  /**
   * @method help
   * @param {string} prefix
   * @returns {void}
   * @description Displays help information for the command
   */
  public help(prefix = ""): void {
    console.info(`${prefix}${this.name}: ${this.description}`);

    if (this.options.length > 0) {
      console.info(`${prefix}  Options:`);
      for (const option of this.options) {
        console.info(
          `${prefix}    ${option.flag}: ${option.description}${
            option.defaultValue !== undefined
              ? ` (default: ${option.defaultValue})`
              : ""
          }`
        );
      }
    }

    if (this.subcommands.size > 0) {
      console.info(`${prefix}  Commands:`);
      for (const subcommand of this.subcommands.values()) {
        subcommand.help(`${prefix}    `);
      }
    }
  }

  /**
   * @method registerAction
   * @param {Function} callback
   * @returns {Command}
   * @description Registers an action for the command
   */
  public registerAction(callback: (argv: any) => void): Command {
    this.on(this.name, callback);
    return this;
  }

  /**
   * @getter name
   * @returns {string}
   * @description Gets the name of the command
   */
  public get name(): string {
    return this.state.name;
  }

  /**
   * @setter name
   * @param {string} name
   * @returns {void}
   * @description Sets the name of the command
   */
  public set name(name: string) {
    this.state.name = name;
  }

  /**
   * @getter description
   * @returns {string}
   * @description Gets the description of the command
   */
  public get description(): string {
    return this.state.description;
  }

  /**
   * @setter description
   * @param {string} description
   * @returns {void}
   * @description Sets the description of the command
   */
  public set description(description: string) {
    this.state.description = description;
  }

  /**
   * @getter aliases
   * @returns {string[]}
   * @description Gets the aliases of the command
   */
  public get aliases(): string[] {
    return this.state.aliases;
  }

  /**
   * @setter aliases
   * @param {string[]} aliases
   * @returns {void}
   * @description Sets the aliases of the command
   */
  public set aliases(aliases: string[]) {
    this.state.aliases = aliases;
  }

  /**
   * @getter options
   * @returns {Option[]}
   * @description Gets the options of the command
   */
  public get options(): Option[] {
    return this.state.options;
  }

  /**
   * @setter options
   * @param {Option[]} options
   * @returns {void}
   * @description Sets the options of the command
   */
  public set options(options: Option[]) {
    this.state.options = options;
  }

  /**
   * @getter subcommands
   * @returns {Map<string, Command>}
   * @description Gets the subcommands of the command
   */
  public get subcommands(): Map<string, Command> {
    return this.state.subcommands;
  }
}
