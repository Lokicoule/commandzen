import { ArgumentParser } from "./ArgumentParser";

/**
 * @type ArgumentProps
 * @description
 * Represents the properties of an Argument.
 * @property {string} flag
 * @property {string} description
 */
export type ArgumentProps = {
  flag: string;
  description: string;
  defaultValue?: unknown;
};

/**
 * @class Argument
 * @description
 * Represents a command line Argument.
 */
export class Argument {
  private constructor(
    public readonly flag: string,
    public readonly description: string,
    public readonly key: string | undefined,
    public readonly required: boolean,
    public readonly defaultValue: unknown | undefined
  ) {}

  /**
   * @method create
   * @param {ArgumentProps} props
   * @returns {Argument}
   * @description
   * Creates a new argument.
   * @static
   */
  public static create(props: ArgumentProps): Argument {
    const { key, required } = ArgumentParser.parse(props.flag);

    return new Argument(
      props.flag,
      props.description,
      key,
      required,
      props.defaultValue
    );
  }
}
