import { CommandConfig } from "../config/CommandConfig";
import { OptionConfig } from "../config/OptionConfig";
import { Command } from "./Command";

describe("Command", () => {
  let command: Command;

  beforeEach(() => {
    command = new Command();
  });

  describe("registerCommand", () => {
    it("should register a command", () => {
      const commandConfig = new CommandConfig({
        name: "test",
        description: "A test command",
      });
      command.registerCommand(commandConfig);
      expect(command["cli"]["commands"].get("test")).toEqual(commandConfig);
    });

    it("should register command aliases", () => {
      const commandConfig = new CommandConfig({
        name: "test",
        description: "A test command",
        aliases: ["t"],
      });
      command.registerCommand(commandConfig);
      expect(command["cli"]["commands"].get("test")).toEqual(commandConfig);
      expect(command["cli"]["commands"].get("t")).toEqual(commandConfig);
    });
  });

  describe("registerDefaultOptions", () => {
    it("should register default options for the default command", () => {
      const options: OptionConfig[] = [
        {
          shortName: "-v",
          longName: "--verbose",
          description: "Enable verbose output",
          argument: {
            type: "boolean",
            required: false,
          },
        } as OptionConfig,
      ];
      command.registerDefaultOptions(options);
      expect(command["cli"]["defaultCommand"].options).toEqual(options);
    });
  });

  it("should display help and throw an error for unknown command", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();
    const args = ["unknown"];
    expect(() => command.parse(args)).toThrowError("Unknown command: unknown");
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith("Usage: cli [command] [options]");
    expect(spy).toHaveBeenCalledWith("");
    expect(spy).toHaveBeenCalledWith("Available commands:");
    spy.mockRestore();
  });
});
