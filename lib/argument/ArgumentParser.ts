import { Argument, ArgumentValue } from "./Argument";

export class ArgumentParser {
  public static parse(argument: Argument, value: string): ArgumentValue {
    switch (argument.type) {
      case "string":
        return value;
      case "number":
        return !isNaN(Number(value))
          ? Number(value)
          : argument.defaultValue ?? 0;
      case "boolean":
        return value?.toLowerCase() !== "false";
      default:
        throw new Error(`Unknown type: ${argument.type}`);
    }
  }
}
