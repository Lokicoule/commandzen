import { ArgumentValue } from "../argument/Argument";
import { Option } from "./Option";

export class OptionParser {
  static parse(
    option: Option,
    args: string[],
    index: number
  ): { value: ArgumentValue; index: number } {
    let value: ArgumentValue;

    if (option.argument) {
      const nextArg = args[index + 1];
      if (option.argument.required && nextArg === undefined) {
        throw new Error(`Missing argument for option ${option.longName}`);
      }
      value = this.parseValue(option, nextArg);
      index++;
    } else {
      value = true;
    }

    return { value, index };
  }

  private static parseValue(option: Option, value: string): ArgumentValue {
    switch (option.argument?.type) {
      case "string":
        return value;
      case "number":
        return !isNaN(Number(value))
          ? Number(value)
          : option.argument.defaultValue ?? 0;
      case "boolean":
        return value?.toLowerCase() !== "false";
      default:
        throw new Error(`Unknown type: ${option.argument?.type}`);
    }
  }
}
