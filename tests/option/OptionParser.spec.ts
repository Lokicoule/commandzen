import { Argument, Option } from "../../lib";
import { OptionParser } from "../../lib/option/OptionParser";

describe("OptionParser", () => {
  describe("parseValue", () => {
    it("should parse a string value", () => {
      const option = new Option({
        shortName: "-f",
        longName: "--file",
        argument: Argument.create({ type: "string" }),
      });

      expect(OptionParser.parseValue(option, "file.txt")).toEqual("file.txt");
    });

    it("should parse a number value", () => {
      const option = new Option({
        shortName: "-n",
        longName: "--number",
        argument: Argument.create({ type: "number" }),
      });

      expect(OptionParser.parseValue(option, "42")).toEqual(42);
    });

    it("should parse a boolean value", () => {
      const option = new Option({
        shortName: "-b",
        longName: "--boolean",
        argument: Argument.create({ type: "boolean" }),
      });

      expect(OptionParser.parseValue(option, "true")).toEqual(true);
      expect(OptionParser.parseValue(option, "false")).toEqual(false);
    });

    it("should throw an error for unknown type", () => {
      const option = new Option({
        shortName: "-x",
        longName: "--unknown",
        argument: { type: "invalid" } as any,
      });

      expect(() => OptionParser.parseValue(option, "value")).toThrowError(
        "Unknown type: invalid"
      );
    });
  });

  describe("parse", () => {
    let option: Option;
    let args: string[];
    let index: number;

    beforeEach(() => {
      option = new Option({ shortName: "-f", longName: "--file" });
      args = ["-f", "file.txt"];
      index = 0;
    });

    it("should parse a boolean option", () => {
      option = new Option({ shortName: "-v", longName: "--verbose" });
      args = ["-v"];
      index = 0;

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: true, index: 0 });
    });

    it("should parse a string option", () => {
      option = new Option({
        shortName: "-f",
        longName: "--file",
        argument: Argument.create({ type: "string" }),
      });

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: "file.txt", index: 1 });
    });

    it("should parse a number option", () => {
      option = new Option({
        shortName: "-n",
        longName: "--number",
        argument: Argument.create({ type: "number" }),
      });
      args = ["-n", "42"];

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: 42, index: 1 });
    });

    it("should parse a boolean option", () => {
      option = new Option({
        shortName: "-b",
        longName: "--boolean",
        argument: Argument.create({ type: "boolean" }),
      });
      args = ["-b", "true"];

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: true, index: 1 });
    });

    it("should throw an error for unknown type", () => {
      option = new Option({
        shortName: "-x",
        longName: "--unknown",
        argument: { type: "invalid" } as any,
      });

      expect(() => OptionParser.parse(option, args, index)).toThrowError(
        "Unknown type: invalid"
      );
    });
  });
});
