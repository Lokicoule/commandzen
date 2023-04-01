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
        return value?.toLowerCase() !== "false";
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}
