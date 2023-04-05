import { Command, CommandProps } from "../lib/Command";
import { Option, OptionProps } from "../lib/Option";
import { CliBuilder } from "../lib/CliBuilder";

describe("CliBuilder", () => {
  const createCliBuilder = () =>
    new CliBuilder({ name: "test", description: "Test CLI" });

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

    it("should create a help command and option", () => {
      const cli = createCliBuilder();
      const defaultCommand = cli["defaultCommand"];

      expect(defaultCommand.subcommands.has("help")).toBeTruthy();

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

    it("should add a help command and option to the added command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.addCommand(testCommand);

      expect(testCommand.subcommands.has("help")).toBeTruthy();

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

    it("should add a help command and option to the new default command", () => {
      const cli = createCliBuilder();
      const testCommand = createTestCommand();

      cli.setDefaultCommand(testCommand);

      expect(testCommand.subcommands.has("help")).toBeTruthy();

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
});
