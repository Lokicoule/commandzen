/**
 * @class OptionParser
 * @description
 * Parses an option flag.
 */
export class OptionParser {
  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * @method parse
   * @param {string} flag
   * @returns {OptionParserResult}
   * @description
   * Parses the flag.
   * @static
   */
  public static parse(flag: string): {
    shortName: string | undefined;
    longName: string | undefined;
    key: string | undefined;
    required: boolean;
  } {
    const { shortName, longName } = this.extractShortAndLongNames(flag);
    const { key, required } = this.extractKeyAndRequired(flag);

    return { shortName, longName, key, required };
  }

  /**
   * @method extractShortAndLongNames
   * @param {string} flag
   * @returns {OptionParserResult}
   * @description
   * Extracts the short and long names from the flag.
   */
  private static extractShortAndLongNames(flag: string): {
    shortName: string | undefined;
    longName: string | undefined;
  } {
    const flagPattern = /(-\w+)|(--[\w-]+)/g;
    const flagMatches = [...flag.matchAll(flagPattern)];

    return flagMatches.reduce(
      (acc, [, short, long]) => ({
        shortName: short ? short : acc.shortName,
        longName: long ? long : acc.longName,
      }),
      { shortName: "", longName: "" }
    );
  }

  /**
   * @method extractKeyAndRequired
   * @param {string} flag
   * @returns {OptionParserResult}
   * @description
   * Extracts the key and required flag from the flag.
   */
  private static extractKeyAndRequired(flag: string): {
    key: string | undefined;
    required: boolean;
  } {
    const keyPattern = /<(\w+)>|\[(\w+)\]/;
    const keyMatch = flag.match(keyPattern);

    const required = keyMatch ? !!keyMatch[1] : false;

    const key = this.extractKey(flag);

    return { key, required };
  }

  /**
   * @method extractKey
   * @param {string} flag
   * @returns {string | undefined}
   * @description
   * Extracts the key from the flag.
   */
  private static extractKey(flag: string): string | undefined {
    const longName = this.extractShortAndLongNames(flag).longName;
    const shortName = this.extractShortAndLongNames(flag).shortName;

    return longName
      ? longName
          .replace(/^--/, "")
          .replace(/-/g, " ")
          .split(" ")
          .map((word, i) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("")
      : shortName?.replace(/^-/, "");
  }
}
