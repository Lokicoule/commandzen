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
});
