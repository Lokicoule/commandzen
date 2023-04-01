import { CLI } from "./CLI";
import { CommandConfig } from "../config/CommandConfig";
import { OptionConfig } from "../config/OptionConfig";

describe("CLI", () => {
  describe("registerCommand", () => {
    it("should add the command to the commands map", () => {
      const cli = new CLI();
      const commandConfig = new CommandConfig({
        name: "test",
        description: "Test command",
      });

      cli.registerCommand(commandConfig);

      expect(cli["commands"].get("test")).toBe(commandConfig);
    });

    it("should add aliases to the commands map", () => {
      const cli = new CLI();
      const commandConfig = new CommandConfig({
        name: "test",
        description: "Test command",
        aliases: ["t", "testing"],
      });

      cli.registerCommand(commandConfig);

      expect(cli["commands"].get("test")).toBe(commandConfig);
      expect(cli["commands"].get("t")).toBe(commandConfig);
      expect(cli["commands"].get("testing")).toBe(commandConfig);
    });
  });

  describe("registerDefaultOptions", () => {
    it("should set the default command options", () => {
      const cli = new CLI();
      const options = [
        new OptionConfig({
          shortName: "-v",
          longName: "--verbose",
          description: "Display verbose output",
        }),
      ];

      cli.registerDefaultOptions(options);

      expect(cli["defaultCommand"].options).toBe(options);
    });
  });

  describe("parse", () => {
    it("should return a map of parsed arguments", () => {
      const cli = new CLI();
      const commandConfig = new CommandConfig({
        name: "test",
        options: [
          new OptionConfig({
            shortName: "-f",
            longName: "--file",
            argument: { type: "string", required: true },
          }),
        ],
      });
      cli.registerCommand(commandConfig);

      const args = ["test", "-f", "file.txt"];
      const result = cli.parse(args);

      expect(result.get("test")).toEqual({ file: "file.txt" });
    });

    it("should throw an error if command is unknown", () => {
      const cli = new CLI();

      expect(() => cli.parse(["unknown"])).toThrowError(
        "Unknown command: unknown"
      );
    });

    it("should display help if an error occurs during parsing", () => {
      const cli = new CLI();
      jest.spyOn(cli, "displayHelp");

      const commandConfig = new CommandConfig({
        name: "test",
        options: [
          new OptionConfig({
            shortName: "-f",
            longName: "--file",
            argument: { type: "string", required: true },
          }),
        ],
      });
      cli.registerCommand(commandConfig);

      const args = ["test", "-f"];
      expect(() => cli.parse(args)).toThrowError(
        "Missing argument for option --file"
      );
      expect(cli.displayHelp).toHaveBeenCalled();
    });
  });

  describe("displayHelp", () => {
    it("should print the help information to the console", () => {
      const cli = new CLI();

      const commandConfig1 = new CommandConfig({
        name: "test1",
        description: "Test command 1",
      });
      const commandConfig2 = new CommandConfig({
        name: "test2",
        description: "Test command 2",
        options: [
          new OptionConfig({
            shortName: "-f",
            longName: "--file",
            argument: { type: "string", required: true },
            description: "File to use",
          }),
        ],
      });
      cli.registerCommand(commandConfig1);
      cli.registerCommand(commandConfig2);

      const logSpy = jest.spyOn(console, "log").mockImplementation();

      cli.displayHelp();

      expect(logSpy).toHaveBeenCalledWith("Usage: cli [command] [options]");
      expect(logSpy).toHaveBeenCalledWith("Available commands:");
      expect(logSpy).toHaveBeenCalledWith("  test1");
      expect(logSpy).toHaveBeenCalledWith("    Test command 1");
      expect(logSpy).toHaveBeenCalledWith("  test2");
      expect(logSpy).toHaveBeenCalledWith("    Test command 2");
      expect(logSpy).toHaveBeenCalledWith("    Options:");
      expect(logSpy).toHaveBeenCalledWith(
        "      -f, --file, <string>, File to use"
      );
    });
  });
});
