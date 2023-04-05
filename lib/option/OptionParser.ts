import { ArgumentValue } from "../argument/Argument";
import { ArgumentParser } from "../argument/ArgumentParser";
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
      value = ArgumentParser.parse(option.argument, nextArg);
      index++;
    } else {
      value = true;
    }

    return { value, index };
  }
}
