import { OptionConfig } from "src/types";

/**
 * @class OptionParser
 * @description
 * The OptionParser class is used to parse the value of an option.
 * An option can have an argument, which is a value that can be passed to the option.
 * If the option has an argument, the value of the argument is parsed and returned.
 * If the option does not have an argument, the value true is returned.
 * If the option has an argument and the argument is required, an error is thrown.
 * If the option has an argument and the argument is not required, the value undefined is returned.
 */
export class OptionParser {
  static parse(
    option: OptionConfig,
    args: string[],
    index: number
  ): { value: any; index: number } {
    let value: any;
    if (option.argument) {
      if (index + 1 < args.length && !args[index + 1].startsWith("-")) {
        value = args[index + 1];
        index++;
      } else if (option.argument.required) {
        throw new Error(
          `Missing required argument for option: ${option.shortName}`
        );
      }
    } else {
      value = true;
    }
    return { value, index };
  }
}
