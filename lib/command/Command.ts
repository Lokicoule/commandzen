import { EventEmitter } from "events";
import { paddingRight } from "../utils/padding";
import { Option, OptionProps } from "../option";

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
  aliases?: string[];
  options?: Option[];
  subcommands?: Map<string, Command>;
};

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
   * @param {OptionProps} option
   * @returns {Command}
   * @description Adds an option to the command
   */
  public addOption(...option: OptionProps[]): Command {
    this.options.push(...option.map((o) => Option.create(o)));
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
   * @method findSubcommand
   * @param {string} name
   * @returns {Command | undefined}
   * @description Finds a subcommand by its name
   */
  public findSubcommand(name: string): Command | undefined {
    return this.subcommands.get(name);
  }

  /**
   * @method help
   * @param {number} [indentationLevel=0]
   * @param {string} [fullName=this.name]
   * @param {string} [subcommandIndex=""]
   * @returns {void}
   * @description Prints the help message for the command
   */
  public help(
    indentationLevel = 0,
    fullName = this.name,
    subcommandIndex = ""
  ): void {
    const indent = "  ";
    const prefix = indent.repeat(indentationLevel);

    console.info(`${prefix}Usage: ${fullName} [options]`);
    console.info(`\n${prefix}${this.description}`);

    if (this.options.length > 0) {
      const maxLength = this.options.reduce(
        (max, option) => Math.max(max, option.flag.length),
        0
      );

      console.info(`\n${prefix}Options:`);
      for (const option of this.options) {
        const paddedFlag = paddingRight(option.flag, maxLength);
        console.info(`${prefix}${indent}${paddedFlag}  ${option.description}`);
      }
      console.info();
    }

    if (this.subcommands.size > 0) {
      console.info(`\n${prefix}Subcommands:`);
      let index = 1;
      for (const subcommand of this.subcommands.values()) {
        const newIndex = `${
          subcommandIndex ? subcommandIndex + "." : ""
        }${index}`;
        console.info(`${prefix}${indent}${newIndex}. ${subcommand.name}`);
        subcommand.help(
          indentationLevel + 1,
          `${fullName} ${subcommand.name}`,
          newIndex
        );
        index++;
      }
    }

    if (indentationLevel === 0) {
      console.info(
        `Run ${fullName} [command] --help for more information on a command.`
      );
    }
  }

  /**
   * @method registerAction
   * @param {Function} callback
   * @returns {Command}
   * @description Registers an action for the command
   */
  public registerAction<T>(callback: (props: T) => void): Command {
    this.on(this.name, callback);
    return this;
  }
}
