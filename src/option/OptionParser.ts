import { ArgumentValue } from "src/config/ArgumentConfig";
import { OptionConfig } from "src/config/OptionConfig";

export class OptionParser {
  static parse(
    option: OptionConfig,
    args: string[],
    index: number
  ): { value: ArgumentValue; index: number } {
    let value: ArgumentValue;

    if (option.argument) {
      const nextArg = args[index + 1];
      if (option.argument.required && nextArg === undefined) {
        throw new Error(`Missing argument for option ${option.longName}`);
      }
      value = this.parseValue(option.argument.type, nextArg);
      index++;
    } else {
      value = true;
    }

    return { value, index };
  }

  private static parseValue(type: string, value: string): ArgumentValue {
    switch (type) {
      case "string":
        return value;
      case "number":
        return Number(value);
      case "boolean":
        return Boolean(value);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}
