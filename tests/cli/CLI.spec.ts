import { Argument, CLI, Command, Option } from "../../lib";

describe("CLI", () => {
  let cli: CLI;

  beforeEach(() => {
    cli = new CLI();
  });

  test("registerDefaultOptions should register options for the default command", () => {
    const options = [new Option({ longName: "--test", shortName: "-t" })];

    cli.registerDefaultOptions(options);

    expect(cli["defaultCommand"].options).toEqual(options);
  });

  test("registerCommand should register multiple commands and their aliases", () => {
    const command1 = new Command({
      name: "test1",
      aliases: ["t1", "testing1"],
    });
    const command2 = new Command({
      name: "test2",
      aliases: ["t2", "testing2"],
    });

    cli.registerCommand(command1);
    cli.registerCommand(command2);

    expect(cli["commands"].get("test1")).toEqual(command1);
    expect(cli["commands"].get("t1")).toEqual(command1);
    expect(cli["commands"].get("testing1")).toEqual(command1);
    expect(cli["commands"].get("test2")).toEqual(command2);
    expect(cli["commands"].get("t2")).toEqual(command2);
    expect(cli["commands"].get("testing2")).toEqual(command2);
  });

  test("parse should correctly parse options with different data types", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
        new Option({
          longName: "--flag",
          shortName: "-f",
          argument: Argument.create({ type: "boolean" }),
        }),
      ],
    });

    command.execute = jest.fn();

    cli.registerCommand(command);

    cli.parse(["test", "-v", "42", "-f", "true"]);

    expect(command.execute).toHaveBeenCalledWith({ value: 42, flag: true });
  });

  test("parse should correctly parse options with default values", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number", defaultValue: 42 }),
        }),
      ],
    });

    command.execute = jest.fn();

    cli.registerCommand(command);

    cli.parse(["test", "-v"]);

    expect(command.execute).toHaveBeenCalledWith({ value: 42 });
  });

  test("registerCommand should register a command and its aliases", () => {
    const command = new Command({
      name: "test",
      aliases: ["t", "testing"],
    });

    cli.registerCommand(command);

    expect(cli["commands"].get("test")).toEqual(command);
    expect(cli["commands"].get("t")).toEqual(command);
    expect(cli["commands"].get("testing")).toEqual(command);
  });

  test("parse should execute the correct command with parsed options", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "string" }),
        }),
      ],
    });

    command.execute = jest.fn();

    cli.registerCommand(command);

    cli.parse(["test", "-v", "42"]);

    expect(command.execute).toHaveBeenCalledWith({ value: "42" });
  });

  test("parse should throw an error if required options are missing", () => {
    const command = new Command({
      name: "test",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number", required: true }),
        }),
      ],
    });

    cli.registerCommand(command);

    expect(() => {
      cli.parse(["test", "-v"]);
    }).toThrowError("Missing argument for option --value");
  });

  test("getHelp should return help message for individual commands", () => {
    const command = new Command({
      name: "test",
      description: "A test command",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "number" }),
        }),
      ],
    });

    cli.registerCommand(command);

    const expectedHelp = `test\n  A test command\n  Options:\n    -v, --value [number]\n`;
    console.log(command.getHelp());
    expect(command.getHelp()).toEqual(expectedHelp);
  });

  test("getHelp should return help message for all commands", () => {
    const command1 = new Command({
      name: "test1",
      description: "A test command",
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
      description: "A test command",
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

    console.log(cli.getHelp());
    const expectedHelp = `Usage: cli [command] [options]\n\nAvailable commands:\ntest1\n  A test command\n  Options:\n    -v, --value [number]\ntest2\n  A test command\n  Options:\n    -f, --flag [boolean]\n`;
    expect(cli.getHelp()).toEqual(expectedHelp);
  });

  test("parse should throw an error if an unknown command is entered", () => {
    cli.registerCommand(new Command({ name: "test" }));

    expect(() => {
      cli.parse(["unknown"]);
    }).toThrowError("Unknown command: unknown");
  });

  test("parse should execute the correct command with parsed options", () => {
    const command1 = new Command({
      name: "test1",
      options: [
        new Option({
          longName: "--value",
          shortName: "-v",
          argument: Argument.create({ type: "string" }),
        }),
      ],
    });

    command1.execute = jest.fn();

    const command2 = new Command({
      name: "test2",
      options: [
        new Option({
          longName: "--flag",
          shortName: "-f",
          argument: Argument.create({ type: "boolean" }),
        }),
      ],
    });

    command2.execute = jest.fn();

    cli.registerCommand(command1);
    cli.registerCommand(command2);

    cli.parse(["test1", "-v", "42"]);

    expect(command1.execute).toHaveBeenCalledWith({ value: "42" });
    expect(command2.execute).not.toHaveBeenCalled();
  });

  test("registerDefaultOptions should register global options for all commands", () => {
    const options = [
      new Option({ longName: "--verbose", shortName: "-v" }),
      new Option({
        longName: "--config",
        shortName: "-c",
        argument: Argument.create({ type: "string" }),
      }),
    ];

    cli.registerDefaultOptions(options);

    const command1 = new Command({
      name: "test1",
      options: [new Option({ longName: "--value", shortName: "-v" })],
    });

    command1.execute = jest.fn();

    cli.registerCommand(command1);

    const command2 = new Command({
      name: "test2",
      options: [new Option({ longName: "--flag", shortName: "-f" })],
    });

    command2.execute = jest.fn();

    cli.registerCommand(command2);

    cli.parse(["test1", "-v"]);

    expect(command1.execute).toHaveBeenCalledWith({
      value: true,
    });

    cli.parse(["test2", "-f"]);

    expect(command2.execute).toHaveBeenCalledWith({
      flag: true,
    });

    expect(() => cli.parse(["test1", "-v", "-c", "config.json"])).toThrowError(
      "Unknown option: -c"
    );
  });
});
