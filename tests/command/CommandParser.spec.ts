import { CommandParser } from "../../lib/command/CommandParser";
import { Argument, Command, Option } from "../../lib";

describe("CommandParser", () => {
  const command = Command.create({
    name: "test",
    options: [
      Option.create({
        shortName: "-s",
        longName: "--string",
        argument: Argument.create({ type: "string", required: true }),
      }),
      Option.create({
        shortName: "-n",
        longName: "--number",
        argument: Argument.create({ type: "number", required: true }),
      }),
      Option.create({
        shortName: "-b",
        longName: "--boolean",
      }),
    ],
  });

  describe("parseOptions", () => {
    test("parseOptions should parse provided options and arguments", () => {
      const args = ["-s", "testValue", "-n", "42", "--boolean"];

      const expected = {
        string: "testValue",
        number: 42,
        boolean: true,
      };

      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });
  });

  describe("validateOptions", () => {
    test("validateOptions should not throw an error when required option is not provided", () => {
      const options = {
        boolean: true,
      };

      expect(() =>
        CommandParser.validateOptions(command, options)
      ).not.toThrow();
    });

    test("validateOptions should not throw an error when all required arguments are provided", () => {
      const options = {
        string: "testValue",
        number: 42,
        boolean: true,
      };

      expect(() =>
        CommandParser.validateOptions(command, options)
      ).not.toThrow();
    });

    test("validateOptions should throw an error when required option is not provided", () => {
      const options = {
        string: undefined,
      };

      expect(() => CommandParser.validateOptions(command, options)).toThrow(
        "Missing required option: --string"
      );
    });
  });
});
