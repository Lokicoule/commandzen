import { OptionParser } from "./OptionParser";

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

/**
 * @class Option
 * @description
 * Represents a command line option.
 */
export class Option {
  private constructor(
    public readonly flag: string,
    public readonly description: string,
    public readonly defaultValue: unknown | undefined,
    public readonly shortName: string | undefined,
    public readonly longName: string | undefined,
    public readonly key: string | undefined,
    public readonly required: boolean
  ) {}

  /**
   * @method create
   * @param {OptionProps} props
   * @returns {Option}
   * @description
   * Creates a new option.
   * @static
   */
  public static create(props: OptionProps): Option {
    const { shortName, longName, key, required } = OptionParser.parse(
      props.flag
    );

    return new Option(
      props.flag,
      props.description,
      props.defaultValue,
      shortName,
      longName,
      key,
      required
    );
  }
}
