/* import { Command, CommandProps } from "../lib/command/Command";
import { Option, OptionProps } from "../lib/option/Option";
import { CliBuilder } from "../lib/CliBuilder";

describe("CliBuilder", () => {
  const createCliBuilder = () =>
    CliBuilder.create({
      name: "test",
      description: "Test CLI",
    });

  const createTestCommand = (props: Partial<CommandProps> = {}) =>
    Command.create({
      name: "test",
      description: "Test command",
      ...props,
    });

  const createTestOption = (props: Partial<OptionProps> = {}) =>
    Option.create({
      flag: "-t, --test",
      description: "Test option",
      ...props,
    });

  describe("constructor", () => {
    it("should create a default command", () => {
      const cli = createCliBuilder();

      expect(cli.parse).toBeDefined();
      expect(cli.addCommand).toBeDefined();
      expect(cli.addOption).toBeDefined();
    });

    it("should create help option", () => {
      const cli = createCliBuilder();
      const defaultCommand = cli["defaultCommand"];

      const helpOption = defaultCommand.options.find(
        (o) => o.shortName === "-h" || o.longName === "--help"
      );

      expect(helpOption).toBeDefined();
    });
  });

  describe("addCommand", () => {
    it("should add a command to the default command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.addCommand(testCommand);

      expect(cli["defaultCommand"].subcommands.get("test")).toBe(testCommand);
    });

    it("should add help option to the added command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.addCommand(testCommand);

      const helpOption = testCommand.options.find(
        (o) => o.shortName === "-h" || o.longName === "--help"
      );

      expect(helpOption).toBeDefined();
    });
  });

  describe("addOption", () => {
    it("should add an option to the default command", () => {
      const cli = createCliBuilder();
      const testOption = createTestOption();

      cli.addOption(testOption);

      expect(cli["defaultCommand"].options).toContainEqual(testOption);
    });
  });

  describe("setDefaultCommand", () => {
    it("should set the default command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.setDefaultCommand(testCommand);

      expect(cli["defaultCommand"]).toBe(testCommand);
    });

    it("should add help option to the new default command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.setDefaultCommand(testCommand);

      const helpOption = testCommand.options.find(
        (o) => o.shortName === "-h" || o.longName === "--help"
      );

      expect(helpOption).toBeDefined();
    });
  });

  describe("parse", () => {
    it("should execute the default command if no command is specified", () => {
      const cli = createCliBuilder();
      const spy = jest.fn();

      cli["defaultCommand"].registerAction(spy);

      cli.parse();

      expect(spy).toHaveBeenCalled();
    });

    it("should execute the specified command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();
      const spy = jest.fn();

      testCommand.registerAction(spy);

      cli.addCommand(testCommand);

      cli.parse(["test"]);

      expect(spy).toHaveBeenCalled();
    });

    it("should execute the specified command with the specified options", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();
      const testOption = createTestOption();
      const spy = jest.fn();

      testCommand.registerAction(spy);
      testCommand.addOption(testOption);

      cli.addCommand(testCommand);

      cli.parse(["test", "-t"]);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("help", () => {
    it("should display help information for the default command", () => {
      const cli = createCliBuilder();
      const spy = jest.spyOn(console, "info");
      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      cli.parse(["-h"]);

      expect(spy).toHaveBeenCalled();
      exitSpy.mockRestore();
    });

    it("should display help information for the specified command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();
      const spy = jest.spyOn(console, "info");
      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      cli.addCommand(testCommand);

      cli.parse(["test", "-h"]);

      expect(spy).toHaveBeenCalled();
      exitSpy.mockRestore();
    });
  });

  describe("parseArgs", () => {
    let cliBuilder: CliBuilder;
    let mockExit: jest.SpyInstance;

    beforeEach(() => {
      mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called");
      });
    });

    afterEach(() => {
      mockExit.mockRestore();
    });

    it("should exit for required option without argument", () => {
      const requiredOptionCommand = Command.create({
        name: "req-opt",
        description: "Command with required option",
      }).addOption(
        Option.create({
          flag: "-r, --required <value>",
          description: "Required option",
        })
      );
      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      cliBuilder.addCommand(requiredOptionCommand);
      const spy = jest.spyOn(console, "error").mockImplementation();

      const argv = ["req-opt", "-r"];

      cliBuilder.parse(argv);

      expect(spy).toHaveBeenCalledWith(
        'The option "-r, --required <value>" requires an argument, but it was not provided.'
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it("should not exit for required option with argument", () => {
      const requiredOptionCommand = Command.create({
        name: "req-opt",
        description: "Command with required option",
      }).addOption(
        Option.create({
          flag: "-r, --required <value>",
          description: "Required option",
        })
      );

      cliBuilder.addCommand(requiredOptionCommand);

      const argv = ["req-opt", "--required", "argument"];

      expect(() => cliBuilder.parse(argv)).not.toThrow();
    });

    it("should not exit for non-required option without argument", () => {
      const nonRequiredOptionCommand = Command.create({
        name: "non-req-opt",
        description: "Command with non-required option",
      }).addOption(
        Option.create({
          flag: "-n, --non-required [value]",
          description: "Non-required option",
        })
      );

      cliBuilder.addCommand(nonRequiredOptionCommand);

      const argv = ["non-req-opt", "--non-required"];

      expect(() => cliBuilder.parse(argv)).not.toThrow();
    });

    it("should not exit for non-required option with argument", () => {
      const nonRequiredOptionCommand = Command.create({
        name: "non-req-opt",
        description: "Command with non-required option",
      }).addOption(
        Option.create({
          flag: "-n, --non-required [value]",
          description: "Non-required option",
        })
      );

      cliBuilder.addCommand(nonRequiredOptionCommand);

      const argv = ["non-req-opt", "--non-required", "argument"];

      expect(() => cliBuilder.parse(argv)).not.toThrow();
    });

    it("should add to arguments array for non-required option with argument", () => {
      const nonRequiredOptionCommand = Command.create({
        name: "non-req-opt",
        description: "Command with non-required option",
      }).addOption(
        Option.create({
          flag: "-n, --non-required [value]",
          description: "Non-required option",
        })
      );

      const spy = jest.fn();

      nonRequiredOptionCommand.registerAction(spy);

      cliBuilder.addCommand(nonRequiredOptionCommand);

      const argv = ["non-req-opt", "argument"];

      cliBuilder.parse(argv);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          args: ["argument"],
        })
      );
    });
  });
});
 */
