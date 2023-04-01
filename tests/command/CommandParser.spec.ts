import { CommandParser, ParsedOptions } from "../../lib/command/CommandParser";
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
    test("should correctly handle a single option with a string argument", () => {
      const args = ["-s", "testValue"];
      const expected = {
        string: "testValue",
      };
      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("should correctly handle a single option with a numeric argument", () => {
      const args = ["-n", "42"];
      const expected = {
        number: 42,
      };
      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("should correctly handle a single option with a boolean argument", () => {
      const args = ["-b"];
      const expected = {
        boolean: true,
      };
      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("should correctly handle multiple options with different arguments", () => {
      const args = ["-s", "testValue", "-n", "42", "--boolean"];
      const expected = {
        string: "testValue",
        number: 42,
        boolean: true,
      };
      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("should correctly handle options with duplicate names", () => {
      const args = ["-s", "testValue1", "-s", "testValue2"];
      const expected = {
        string: "testValue2",
      };
      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("should correctly handle options with duplicate short names", () => {
      const options = [
        Option.create({
          shortName: "-s",
          longName: "--string1",
          argument: Argument.create({ type: "string", required: true }),
        }),
        Option.create({
          shortName: "-s",
          longName: "--string2",
          argument: Argument.create({ type: "string", required: true }),
        }),
      ];
      const cmd = Command.create({ name: "test", options });
      const args = ["-s", "testValue"];
      const expected = {
        string1: "testValue",
      };
      expect(CommandParser.parseOptions(cmd, args)).toEqual(expected);
    });

    test("should correctly handle options with duplicate long names", () => {
      const options = [
        Option.create({
          shortName: "-s1",
          longName: "--string",
          argument: Argument.create({ type: "string", required: true }),
        }),
        Option.create({
          shortName: "-s2",
          longName: "--string",
          argument: Argument.create({ type: "string", required: true }),
        }),
      ];
      const cmd = Command.create({ name: "test", options });
      const args = ["--string", "testValue"];
      const expected = {
        string: "testValue",
      };
      expect(CommandParser.parseOptions(cmd, args)).toEqual(expected);

      const args2 = ["-s2", "testValue"];
      const expected2 = {
        string: "testValue",
      };
      expect(CommandParser.parseOptions(cmd, args2)).toEqual(expected2);
    });
    test("parseOptions should return an empty object if no options are provided", () => {
      const args: string[] = [];

      const expected: ParsedOptions = {};

      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("parseOptions should parse provided options and arguments", () => {
      const args = ["-s", "testValue", "-n", "42", "--boolean"];

      const expected: ParsedOptions = {
        string: "testValue",
        number: 42,
        boolean: true,
      };

      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("parseOptions should throw an error when an unknown option is provided", () => {
      const args = ["-s", "testValue", "-x"];

      expect(() => CommandParser.parseOptions(command, args)).toThrow(
        "Unknown option: -x"
      );
    });

    test("parseOptions should parse an option with a boolean value", () => {
      const args = ["-b"];

      const expected: ParsedOptions = {
        boolean: true,
      };

      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });

    test("parseOptions should parse multiple options with the same name", () => {
      const args = ["-s", "testValue1", "-s", "testValue2"];

      const expected: ParsedOptions = {
        string: "testValue2",
      };

      expect(CommandParser.parseOptions(command, args)).toEqual(expected);
    });
  });

  describe("validateOptions", () => {
    test("validateOptions should not throw an error when all options are provided", () => {
      const options = {
        string: "testValue",
        number: 42,
        boolean: true,
      };

      expect(() =>
        CommandParser.validateOptions(command, options)
      ).not.toThrow();
    });

    test("validateOptions should not throw an error when no options are provided", () => {
      const options = {};

      expect(() =>
        CommandParser.validateOptions(command, options)
      ).not.toThrow();
    });

    test("validateOptions should throw an error when a required option is not provided", () => {
      const options = {
        string: undefined,
        number: 42,
        boolean: true,
      } as any as ParsedOptions;

      expect(() => CommandParser.validateOptions(command, options)).toThrow(
        "Missing required option: --string"
      );
    });

    test("validateOptions should throw an error when an unknown option is provided", () => {
      const options = {
        string: "testValue",
        number: 42,
        boolean: true,
        unknown: "value",
      } as ParsedOptions;

      expect(() => CommandParser.validateOptions(command, options)).toThrow(
        "Unknown option: unknown"
      );
    });
  });
});
