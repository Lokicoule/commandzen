import { OptionParser } from "../../lib/option/OptionParser";

describe("OptionParser", () => {
  describe("parse", () => {
    it("short flag without arguments", () => {
      const result = OptionParser.parse("-s");
      expect(result).toEqual({
        shortName: "-s",
        longName: "",
        key: "s",
        required: false,
      });
    });

    it("long flag without arguments", () => {
      const result = OptionParser.parse("--long");
      expect(result).toEqual({
        shortName: "",
        longName: "--long",
        key: "long",
        required: false,
      });
    });

    it("short flag with optional argument", () => {
      const result = OptionParser.parse("-o [opt]");
      expect(result).toEqual({
        shortName: "-o",
        longName: "",
        key: "o",
        required: false,
      });
    });

    it("long flag with optional argument", () => {
      const result = OptionParser.parse("--option [opt]");
      expect(result).toEqual({
        shortName: "",
        longName: "--option",
        key: "option",
        required: false,
      });
    });

    it("short flag with required argument", () => {
      const result = OptionParser.parse("-r <req>");
      expect(result).toEqual({
        shortName: "-r",
        longName: "",
        key: "r",
        required: true,
      });
    });

    it("long flag with required argument", () => {
      const result = OptionParser.parse("--required <req>");
      expect(result).toEqual({
        shortName: "",
        longName: "--required",
        key: "required",
        required: true,
      });
    });

    it("short and long flag combination", () => {
      const result = OptionParser.parse("-c --combo");
      expect(result).toEqual({
        shortName: "-c",
        longName: "--combo",
        key: "combo",
        required: false,
      });
    });

    it("short and long flag with required argument", () => {
      const result = OptionParser.parse("-c --combo <arg>");
      expect(result).toEqual({
        shortName: "-c",
        longName: "--combo",
        key: "combo",
        required: true,
      });
    });

    it("short and long flag with optional argument", () => {
      const result = OptionParser.parse("-c --combo [arg]");
      expect(result).toEqual({
        shortName: "-c",
        longName: "--combo",
        key: "combo",
        required: false,
      });
    });

    it("long flag with multiple words", () => {
      const result = OptionParser.parse("--multi-word");
      expect(result).toEqual({
        shortName: "",
        longName: "--multi-word",
        key: "multiWord",
        required: false,
      });
    });
  });
});
