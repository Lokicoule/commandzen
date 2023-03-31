import { ArgumentConfig, OptionConfig } from "src/types";
import { OptionParser } from "./OptionParser";

describe("OptionParser", () => {
  describe("parse", () => {
    it("should parse the value of an option", () => {
      const option = {
        shortName: "-v",
        longName: "--version",
        argument: undefined,
      } satisfies OptionConfig;
      const args = ["-v"];
      const index = 0;
      const result = OptionParser.parse(option, args, index);
      expect(result.value).toBe(true);
      expect(result.index).toBe(0);
    });

    it("should parse the value of an option with an argument", () => {
      const option = {
        shortName: "-o",
        longName: "--output",
        argument: {
          type: "string",
          required: true,
        } satisfies ArgumentConfig,
      } satisfies OptionConfig;
      const args = ["-o", "file.txt"];
      const index = 0;
      const result = OptionParser.parse(option, args, index);
      expect(result.value).toBe("file.txt");
      expect(result.index).toBe(1);
    });

    it("should throw an error if the option has an argument and the argument is required and the argument is missing", () => {
      const option = {
        shortName: "-o",
        longName: "--output",
        argument: {
          type: "string",
          required: true,
        } satisfies ArgumentConfig,
      } satisfies OptionConfig;
      const args = ["-o"];
      const index = 0;
      expect(() => OptionParser.parse(option, args, index)).toThrow(
        "Missing required argument for option: -o"
      );
    });

    it("should parse the value of an option with an argument and the argument is not required and the argument is missing", () => {
      const option = {
        shortName: "-o",
        longName: "--output",
        argument: {
          type: "string",
          required: false,
        } satisfies ArgumentConfig,
      } satisfies OptionConfig;
      const args = ["-o"];
      const index = 0;
      const result = OptionParser.parse(option, args, index);
      expect(result.value).toBe(undefined);
      expect(result.index).toBe(0);
    });
  });
});
