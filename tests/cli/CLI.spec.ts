import { CLI, Command, Option, Argument } from "../../lib";

describe("CLI", () => {
  let cli: CLI;

  beforeEach(() => {
    cli = new CLI();
  });

  test("should register default options", () => {
    const options = [new Option({ longName: "--test", shortName: "-t" })];
    cli.registerDefaultOptions(options);
    expect(cli["defaultCommand"].options).toEqual(options);
  });

  test("should register a command and its aliases", () => {
    const command = new Command({ name: "test", aliases: ["t", "testing"] });
    cli.registerCommand(command);
    expect(cli["commands"].get("test")).toEqual(command);
    expect(cli["commands"].get("t")).toEqual(command);
    expect(cli["commands"].get("testing")).toEqual(command);
  });

  test("should parse and execute a registered command with options", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    const mockExecute = jest.fn();
    command.execute = mockExecute;

    cli.registerCommand(command);
    cli.parse(["test", "-v", "42"]);

    expect(mockExecute).toHaveBeenCalledWith({ value: 42 });
  });

  test("should throw an error for an unknown command", () => {
    cli.registerCommand(new Command({ name: "test" }));
    expect(() => {
      cli.parse(["unknown"]);
    }).toThrowError("Unknown command: unknown");
  });

  test("should display help for all registered commands", () => {
    const command1 = new Command({
      name: "test1",
      description: "Test command 1",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    const command2 = new Command({
      name: "test2",
      description: "Test command 2",
      options: [
        new Option({
          longName: "--flag",
          shortName: "-f",
          argument: Argument.create({ type: "boolean" }),
        }),
      ],
    });

    cli.registerCommand(command1);
    cli.registerCommand(command2);

    const expectedHelp = `Usage: cli [command] [options]\n\nAvailable commands:\n${command1.getHelp()}${command2.getHelp()}`;
    expect(cli.getHelp()).toEqual(expectedHelp);
  });

  test("should display help when no command is given", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    const mockExecute = jest.fn();
    command.execute = mockExecute;

    cli.registerCommand(command);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    expect(() => cli.parse(["toto"])).toThrowError("Unknown command: toto");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("should execute default command when command name starts with a dash", () => {
    const defaultCommand = new Command({
      name: "default",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    const mockExecute = jest.fn();
    defaultCommand.execute = mockExecute;

    const customCommand = new Command({
      name: "custom",
      options: [
        new Option({
          longName: "--test",
          shortName: "-t",
          argument: Argument.create({ type: "string" }),
        }),
      ],
    });

    const customMockExecute = jest.fn();
    customCommand.execute = customMockExecute;

    cli["defaultCommand"] = defaultCommand;
    cli.registerCommand(customCommand);

    cli.parse(["-v", "42"]);

    expect(mockExecute).toHaveBeenCalledWith({ value: 42 });
    expect(customMockExecute).not.toHaveBeenCalled();
  });

  test("should add a default command", () => {
    const command = new Command({
      name: "default",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    const mockExecute = jest.fn();
    command.execute = mockExecute;

    cli.registerDefaultCommand(command);
    cli.parse(["-v", "42"]);

    expect(mockExecute).toHaveBeenCalledWith({ value: 42 });
  });
});
