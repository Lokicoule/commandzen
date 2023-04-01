import { CommandConfig } from "../config/CommandConfig";
import { OptionConfig } from "../config/OptionConfig";
import { ArgumentParser } from "./ArgumentParser";

describe("ArgumentParser", () => {
  let commands: Map<string, CommandConfig>;
  let defaultCommand: CommandConfig;
  let argumentParser: ArgumentParser;

  beforeEach(() => {
    const fileOption = new OptionConfig({
      shortName: "-f",
      longName: "--file",
      argument: { type: "string", required: true },
    });
    const listOption = new OptionConfig({
      shortName: "-l",
      longName: "--list",
    });
    const testCommand = new CommandConfig({
      name: "test",
      options: [fileOption, listOption],
    });
    const helpCommand = new CommandConfig({ name: "help" });

    commands = new Map<string, CommandConfig>([
      [testCommand.name, testCommand],
      [helpCommand.name, helpCommand],
    ]);
    defaultCommand = helpCommand;

    argumentParser = new ArgumentParser(commands, defaultCommand);
  });

  describe("parse", () => {
    it("should parse arguments and return a map of command options", () => {
      const args = ["test", "-f", "file.txt", "-l"];

      const result = argumentParser.parse(args);

      expect(result).toEqual(
        new Map([
          [
            "test",
            {
              file: "file.txt",
              list: true,
            },
          ],
        ])
      );
    });

    it("should throw an error if command is unknown", () => {
      const args = ["unknown"];
      expect(() => argumentParser.parse(args)).toThrowError(
        "Unknown command: unknown"
      );
    });

    it("should throw an error if option is unknown", () => {
      const args = ["test", "-q"];
      expect(() => argumentParser.parse(args)).toThrowError(
        "Unknown option: -q"
      );
    });

    it("should throw an error if argument is missing for required option", () => {
      const args = ["test", "-f"];
      expect(() => argumentParser.parse(args)).toThrowError(
        "Missing argument for option --file"
      );
    });
  });

  describe("getCommand", () => {
    it("should return the command config for a known command", () => {
      const commandConfig = new CommandConfig({ name: "my-command" });
      commands.set("my-command", commandConfig);

      const result = argumentParser.getCommand("my-command");

      expect(result).toEqual(commandConfig);
    });

    it("should return the default command config for an unknown command", () => {
      const result = argumentParser.getCommand("-unknown-command");

      expect(result).toEqual(defaultCommand);
    });

    it("should return the default command config for an option", () => {
      const result = argumentParser.getCommand("-v");

      expect(result).toEqual(defaultCommand);
    });
  });
});
