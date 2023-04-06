/**
 * @class ArgumentParser
 * @description
 * Parses an argument flag.
 */
export class ArgumentParser {
  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * @method parse
   * @param {string} flag
   * @returns {ArgumentParserResult}
   * @description
   * Parses the flag.
   * @static
   */
  public static parse(flag: string): {
    key: string | undefined;
    required: boolean;
  } {
    const { key, required } = this.extractKeyAndRequired(flag);

    return { key, required };
  }

  /**
   * @method extractKeyAndRequired
   * @param {string} flag
   * @returns {ArgumentParserResult}
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
    const keyPattern = /<(\w+)>|\[(\w+)\]/;
    const keyMatch = flag.match(keyPattern);

    const key = keyMatch ? keyMatch[1] || keyMatch[2] : undefined;

    if (key === undefined) {
      console.warn("Please use the following format: <key> or [key]");
      throw new Error("Invalid argument flag");
    }

    return key;
  }
}
