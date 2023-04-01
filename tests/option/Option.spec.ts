import { Argument, Option, OptionProperties } from "../../lib";

describe("Option", () => {
  describe("constructor", () => {
    it("should create an option with the given properties", () => {
      const properties: OptionProperties = {
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      };

      const option = new Option(properties);

      expect(option.shortName).toBe(properties.shortName);
      expect(option.longName).toBe(properties.longName);
      expect(option.description).toBe(properties.description);
      expect(option.argument).toBe(properties.argument);
    });
  });

  describe("create", () => {
    it("should create an option with the given properties", () => {
      const properties: OptionProperties = {
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      };

      const option = Option.create(properties);

      expect(option.shortName).toBe(properties.shortName);
      expect(option.longName).toBe(properties.longName);
      expect(option.description).toBe(properties.description);
      expect(option.argument).toBe(properties.argument);
    });
  });

  describe("getKey", () => {
    it("should return the long name without the prefix if it exists", () => {
      const option = new Option({ shortName: "-f", longName: "--file" });

      expect(option.getKey()).toBe("file");
    });

    it("should return the short name without the prefix if the long name does not exist", () => {
      const option = new Option({ shortName: "-f" });

      expect(option.getKey()).toBe("f");
    });
  });
});
