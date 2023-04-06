import { Command, Option } from "../../lib";

describe("Command", () => {
  let command: Command;

  beforeEach(() => {
    command = Command.create({
      name: "test",
      description: "Test command",
    });
  });

  it("should create a command with name and description", () => {
    expect(command.name).toEqual("test");
    expect(command.description).toEqual("Test command");
  });

  it("should add subcommand", () => {
    const subcommand = Command.create({
      name: "subtest",
      description: "Subtest command",
    });

    command.addSubcommand(subcommand);
    expect(command.subcommands.get("subtest")).toEqual(subcommand);
  });

  it("should add an alias to the command", () => {
    command.addAlias("t", "u", "v");
    expect(command.aliases).toContain("t");
    expect(command.aliases).toContain("u");
    expect(command.aliases).toContain("v");
  });

  it("should add aliases for subcommands", () => {
    const subcommand = Command.create({
      name: "subtest",
      description: "Subtest command",
      aliases: ["st", "subt"],
    });

    command.addSubcommand(subcommand);

    // Check if the subcommand and its aliases were added correctly
    expect(command.subcommands.get("subtest")).toEqual(subcommand);
    expect(command.subcommands.get("st")).toEqual(subcommand);
    expect(command.subcommands.get("subt")).toEqual(subcommand);
  });

  it("should add an option to the command", () => {
    const option = Option.create({
      flag: "-f, --flag",
      description: "Test flag",
    });

    command.addOption(option);
    expect(command.options).toContain(option);
  });

  it("should find an option by its flag", () => {
    const option = Option.create({
      flag: "-f, --flag",
      description: "Test flag",
    });

    command.addOption(option);
    expect(command.findOption("-f")).toEqual(option);
    expect(command.findOption("--flag")).toEqual(option);
  });

  it("should find a subcommand by its name", () => {
    const subcommand = Command.create({
      name: "subtest",
      description: "Subtest command",
    });

    command.addSubcommand(subcommand);
    expect(command.findSubcommand("subtest")).toEqual(subcommand);
  });

  it("should register and trigger an action for the command", (done) => {
    command.registerAction<{ flag: boolean }>((props) => {
      expect(props).toEqual({ flag: true });
      done();
    });

    command.emit("test", {
      flag: true,
    });
  });

  it("should print the help message correctly", () => {
    const rootCommand = Command.create({
      name: "test",
      description: "Test command",
    });
    const subcommand = Command.create({
      name: "subtest",
      description: "Subtest command",
    }).addSubcommand(
      Command.create({
        name: "subsubtest",
        description: "Subsubtest command",
      })
    );

    rootCommand.addSubcommand(subcommand);

    const option = Option.create({
      flag: "-f, --flag",
      description: "Test flag",
    });

    rootCommand.addOption(option);

    // Mock console.info to capture printed output
    const consoleInfoSpy = jest
      .spyOn(console, "info")
      .mockImplementation(() => {});

    rootCommand.help();

    expect(consoleInfoSpy.mock.calls).toEqual([
      ["Usage: test [options]"],
      ["\nTest command"],
      ["\nOptions:"],
      ["  -f, --flag  Test flag"],
      [],
      ["\nSubcommands:"],
      ["  1. subtest"],
      ["  Usage: test subtest [options]"],
      ["\n  Subtest command"],
      ["\n  Subcommands:"],
      ["    1.1. subsubtest"],
      ["    Usage: test subtest subsubtest [options]"],
      ["\n    Subsubtest command"],
      ["Run test [command] --help for more information on a command."],
    ]);

    consoleInfoSpy.mockRestore();
  });
});
