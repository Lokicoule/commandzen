import { Command, CommandParser, Option } from "../../lib";

describe("CommandParser", () => {
  let command: Command;
  let subcommand: Command;

  beforeEach(() => {
    command = Command.create({
      name: "test",
      description: "Test command",
    });

    subcommand = Command.create({
      name: "subtest",
      description: "Subtest command",
    });

    command.addSubcommand(subcommand);

    command.addOption(
      Option.create({
        flag: "-f, --flag",
        description: "Test flag",
      })
    );

    subcommand.addOption(
      Option.create({
        flag: "-s, --subflag",
        description: "Test subflag",
      })
    );
  });

  it("should parse command with options", () => {
    const argv = ["-f", "value1", "--flag", "value2"];
    const commandList = CommandParser.parse(command, argv);
    expect(commandList).toEqual([
      {
        command: command,
        options: {
          flag: "value2",
        },
      },
    ]);
  });

  it("should parse command with subcommand and options", () => {
    const argv = ["subtest", "-s", "value1", "--subflag", "value2"];
    const commandList = CommandParser.parse(command, argv);
    expect(commandList).toEqual([
      {
        command: command,
        options: {},
      },
      {
        command: subcommand,
        options: {
          subflag: "value2",
        },
      },
    ]);
  });

  it("should parse command with subcommand and options for both", () => {
    const argv = [
      "-f",
      "value1",
      "subtest",
      "-s",
      "value2",
      "--flag",
      "value3",
      "--subflag",
      "value4",
    ];
    const commandList = CommandParser.parse(command, argv);
    expect(commandList).toEqual([
      {
        command: command,
        options: {
          flag: "value1",
        },
      },
      {
        command: subcommand,
        options: {
          subflag: "value4",
        },
      },
    ]);
  });

  it("should handle missing required option value", () => {
    const requiredOption = Option.create({
      flag: "-r, --required <value>",
      description: "Required test flag",
    });

    command.addOption(requiredOption);

    command.addOption(requiredOption);

    const argv = ["-r"];

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    CommandParser.parse(command, argv);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(processExitSpy).toHaveBeenCalledTimes(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
