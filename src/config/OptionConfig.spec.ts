import { OptionConfig } from "./OptionConfig";
import { ArgumentConfig } from "./ArgumentConfig";

describe("OptionConfig", () => {
  describe("getKey", () => {
    it("should return the long name without leading dashes if present", () => {
      const option = new OptionConfig({
        shortName: "-f",
        longName: "--file",
      });
      expect(option.getKey()).toEqual("file");
    });

    it("should return the short name without leading dashes if long name is not present", () => {
      const option = new OptionConfig({
        shortName: "-f",
      });
      expect(option.getKey()).toEqual("f");
    });
  });

  describe("getters", () => {
    it("should return the correct values", () => {
      const argument: ArgumentConfig = { type: "string", required: true };
      const option = new OptionConfig({
        shortName: "-f",
        longName: "--file",
        description: "File to read",
        argument,
      });
      expect(option.shortName).toEqual("-f");
      expect(option.longName).toEqual("--file");
      expect(option.description).toEqual("File to read");
      expect(option.argument).toEqual(argument);
    });
  });
});
