import { EventEmitter } from "events";
import { Option } from "../option";

/**
 * @interface CommandProps
 * @description
 * Represents the properties of a command.
 * @property {string} name
 * @property {string} description
 */
export interface CommandProps {
  name: string;
  description: string;
  aliases?: string[];
  options?: Option[];
  subcommands?: Map<string, Command>;
}

interface ActionProps<T> {
  args: string[];
  options: T;
}

/**
 * @class Command
 * @description Represents a command
 * @extends EventEmitter
 */
export class Command extends EventEmitter {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly aliases: string[] = [],
    public readonly options: Option[] = [],
    public readonly subcommands: Map<string, Command> = new Map()
  ) {
    super();
  }

  /**
   * @method create
   * @param {CommandProps} props
   * @returns {Command}
   * @description Creates a new command
   * @static
   */
  public static create(props: CommandProps): Command {
    return new Command(
      props.name,
      props.description,
      props.aliases,
      props.options,
      props.subcommands
    );
  }

  /**
   * @method addSubcommand
   * @param {Command} command
   * @returns {Command}
   * @description Adds a subcommand to the command
   */
  public addSubcommand(command: Command): Command {
    this.subcommands.set(command.name, command);
    command.aliases.forEach((alias) => this.subcommands.set(alias, command));
    return this;
  }

  /**
   * @method addOption
   * @param {Option} option
   * @returns {Command}
   * @description Adds an option to the command
   */
  public addOption(...option: Option[]): Command {
    this.options.push(...option);
    return this;
  }

  /**
   * @method addAlias
   * @param {string} aliases
   * @returns {Command}
   * @description Adds an alias to the command
   */
  public addAlias(...aliases: string[]): Command {
    this.aliases.push(...aliases);
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
  public registerAction<T>(callback: (props: ActionProps<T>) => void): Command {
    this.on(this.name, callback);
    return this;
  }
}
