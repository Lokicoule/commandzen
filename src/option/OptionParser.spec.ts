import { OptionParser } from "./OptionParser";
import { OptionConfig } from "../config/OptionConfig";

describe("OptionParser", () => {
  describe("parse", () => {
    let option: OptionConfig;
    let args: string[];
    let index: number;

    beforeEach(() => {
      option = new OptionConfig({ shortName: "-f", longName: "--file" });
      args = ["-f", "file.txt"];
      index = 0;
    });

    it("should parse a boolean option", () => {
      option = new OptionConfig({ shortName: "-v", longName: "--verbose" });
      args = ["-v"];
      index = 0;

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: true, index: 0 });
    });

    it("should parse a string option", () => {
      option = new OptionConfig({
        shortName: "-f",
        longName: "--file",
        argument: { type: "string" },
      });

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: "file.txt", index: 1 });
    });

    it("should parse a number option", () => {
      option = new OptionConfig({
        shortName: "-n",
        longName: "--number",
        argument: { type: "number" },
      });
      args = ["-n", "42"];

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: 42, index: 1 });
    });

    it("should parse a boolean option", () => {
      option = new OptionConfig({
        shortName: "-b",

        longName: "--boolean",
        argument: { type: "boolean" },
      });
      args = ["-b", "true"];

      const result = OptionParser.parse(option, args, index);

      expect(result).toEqual({ value: true, index: 1 });
    });

    it("should throw an error for unknown type", () => {
      option = new OptionConfig({
        shortName: "-x",
        longName: "--unknown",
        argument: { type: "invalid" } as any,
      });

      expect(() => OptionParser.parse(option, args, index)).toThrowError(
        "Unknown type: invalid"
      );
    });

    it("should throw an error for missing argument", () => {
      option = new OptionConfig({
        shortName: "-f",
        longName: "--file",
        argument: { type: "string", required: true },
      });
      args = ["-f"];

      expect(() => OptionParser.parse(option, args, index)).toThrowError(
        "Missing argument for option --file"
      );
    });
  });
});
