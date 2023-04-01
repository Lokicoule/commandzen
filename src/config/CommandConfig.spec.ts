import { CommandConfig } from "./CommandConfig";
import { OptionConfig } from "./OptionConfig";

describe("CommandConfig", () => {
  describe("getters", () => {
    it("should return the correct values", () => {
      const options: OptionConfig[] = [
        new OptionConfig({ shortName: "-f", longName: "--file" }),
      ];
      const command = new CommandConfig({
        name: "test",
        description: "Test command",
        aliases: ["t"],
        options,
      });
      expect(command.name).toEqual("test");
      expect(command.description).toEqual("Test command");
      expect(command.aliases).toEqual(["t"]);
      expect(command.options).toEqual(options);
    });

    it("should return undefined if property is not defined", () => {
      const command = new CommandConfig({ name: "test" });
      expect(command.description).toBeUndefined();
      expect(command.aliases).toBeUndefined();
      expect(command.options).toBeUndefined();
    });
  });

  describe("set options", () => {
    it("should update the options property", () => {
      const command = new CommandConfig({ name: "test" });
      expect(command.options).toBeUndefined();
      const options: OptionConfig[] = [
        new OptionConfig({ shortName: "-f", longName: "--file" }),
      ];
      command.options = options;
      expect(command.options).toEqual(options);
    });
  });

  describe("findOption", () => {
    it("should return the option with the specified short name", () => {
      const options: OptionConfig[] = [
        new OptionConfig({ shortName: "-f", longName: "--file" }),
      ];
      const command = new CommandConfig({ name: "test", options });
      const option = command.findOption("-f");
      expect(option?.shortName).toEqual("-f");
    });

    it("should return undefined if no option with the specified short name exists", () => {
      const options: OptionConfig[] = [
        new OptionConfig({ shortName: "-f", longName: "--file" }),
      ];
      const command = new CommandConfig({ name: "test", options });
      const option = command.findOption("-q");
      expect(option).toBeUndefined();
    });
  });
});
