import { Argument, Command, Option } from "../../lib";

describe("Command", () => {
  describe("constructor", () => {
    it("should create a command with the given properties", () => {
      const properties = {
        name: "test",
        description: "Test command",
        aliases: ["t"],
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
            argument: Argument.create({ type: "string" }),
          }),
        ],
        action: () => {},
      };

      const command = new Command(properties);

      expect(command.name).toBe(properties.name);
      expect(command.description).toBe(properties.description);
      expect(command.aliases).toEqual(properties.aliases);
      expect(command.options).toEqual(properties.options);
      expect(command.action).toEqual(properties.action);
    });
  });

  describe("option", () => {
    it("should override the options with new options", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });
      const overrideOption = new Option({
        shortName: "-o",
        longName: "--override",
        description: "Override the last option",
      });
      command.options = [overrideOption];

      expect(command.options).toEqual([overrideOption]);
    });

    it("should clear the options if the new options are undefined", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      command.options = undefined;

      expect(command.options).toEqual([]);
    });
  });

  describe("addOption", () => {
    it("should add an option to the command's options", () => {
      const command = new Command({ name: "test" });

      const option = Option.create({
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      });

      command.addOption(option);
      expect(command.options).toEqual([option]);
    });

    it("should return the command instance", () => {
      const command = new Command({ name: "test" });

      const option = new Option({
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      });

      const result = command.addOption(option);

      expect(result).toBe(command);
    });
  });

  describe("execute", () => {
    it("should call the command's action with the given options", () => {
      const command = new Command({
        name: "test",
        action: jest.fn(),
      });

      const options = { file: "input.txt" };

      command.execute(options);

      expect(command.action).toHaveBeenCalledWith(options);
    });
  });

  describe("findOption", () => {
    it("should return the option with the given short name", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      const option = command.findOption("f");

      expect(option?.shortName).toBe("-f");
    });

    it("should return undefined if no option with the given short name exists", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      const option = command.findOption("-u");

      expect(option).toBeUndefined();
    });
  });

  describe("getHelp", () => {
    it("should return the command's help text", () => {
      const command = new Command({
        name: "test",
        description: "Test command",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
            argument: Argument.create({ type: "string", required: true }),
          }),
          new Option({
            shortName: "-v",
            longName: "--verbose",
            description: "Enable verbose logging",
          }),
        ],
      });

      const help = command.getHelp();

      expect(help).toEqual(
        "test\n  Test command\n  Options:\n    -f, --file <string>, Specify the input file\n    -v, --verbose, Enable verbose logging\n"
      );
    });
  });
});
