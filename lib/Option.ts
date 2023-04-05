/**
 * @type OptionProps
 * @description
 * Represents the properties of an option.
 * @property {string} flag
 * @property {string} description
 * @property {unknown} [defaultValue]
 */
export type OptionProps = {
  flag: string;
  description: string;
  defaultValue?: unknown;
};

type PrivateOptionProps = {
  shortName?: string;
  longName?: string;
  key?: string;
  required?: boolean;
};

type OptionState = OptionProps & PrivateOptionProps;

/**
 * @class Option
 * @description
 * Represents a command line option.
 */
export class Option {
  private state: OptionState;

  constructor({ flag, description, defaultValue }: OptionProps) {
    this.state = {
      flag,
      description,
      defaultValue,
      required: false,
    };
    this.parseFlag();
  }

  /**
   * @method create
   * @param {OptionProps} props
   * @returns {Option}
   * @description
   * Creates a new option.
   * @static
   */
  public static create(props: OptionProps): Option {
    return new Option(props);
  }

  /**
   * @getter flag
   * @returns {string}
   * @description
   * Returns the flag for the option.
   */
  public get flag(): string {
    return this.state.flag;
  }

  /**
   * @getter description
   * @returns {string}
   * @description
   * Returns the description for the option.
   */
  public get description(): string {
    return this.state.description;
  }

  /**
   * @getter defaultValue
   * @returns {unknown | undefined}
   * @description
   * Returns the default value for the option.
   */
  public get defaultValue(): unknown | undefined {
    return this.state.defaultValue;
  }

  /**
   * @getter required
   * @returns {boolean}
   * @description
   * Returns true if the option is required.
   */
  public get required(): boolean {
    return this.state.required || false;
  }

  /**
   * @getter shortName
   * @returns {string | undefined}
   * @description
   * Returns the short name for the option.
   */
  public get shortName(): string | undefined {
    return this.state.shortName;
  }

  /**
   * @getter longName
   * @returns {string | undefined}
   * @description
   * Returns the long name for the option.
   */
  public get longName(): string | undefined {
    return this.state.longName;
  }

  /**
   * @getter key
   * @returns {string | undefined}
   * @description
   * Returns the key for the option.
   */
  public get key(): string | undefined {
    return this.state.key;
  }

  /**
   * @method parseFlag
   * @description
   * Parses the flag string and sets the shortName, longName, key and required
   * properties.
   */
  private parseFlag(): void {
    const flagPattern = /(-\w+)|(--[\w-]+)/g;
    const flagMatches = [...this.flag.matchAll(flagPattern)];

    const { shortName, longName } = flagMatches.reduce(
      (acc, [, short, long]) => ({
        shortName: short ? short : acc.shortName,
        longName: long ? long : acc.longName,
      }),
      { shortName: "", longName: "" }
    );

    const keyPattern = /<(\w+)>|\[(\w+)\]/;
    const keyMatch = this.flag.match(keyPattern);

    const required = keyMatch ? !!keyMatch[1] : false;

    const key = longName
      ? longName
          .replace(/^--/, "")
          .replace(/-/g, " ")
          .split(" ")
          .map((word, i) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("")
      : shortName.replace(/^-/, "");

    this.state = { ...this.state, shortName, longName, required, key };
  }
}
