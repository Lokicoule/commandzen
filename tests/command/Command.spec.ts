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
    command.addAlias("t");
    expect(command.aliases).toContain("t");
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

  it("should register and trigger an action for the command", (done) => {
    command.registerAction<{ flag: boolean }>((props) => {
      expect(props.args).toEqual(["arg1", "arg2"]);
      expect(props.options).toEqual({ flag: true });
      done();
    });

    command.emit("test", {
      args: ["arg1", "arg2"],
      options: { flag: true },
    });
  });

  it("should display help information for the command", () => {
    const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    const command = Command.create({
      name: "test",
      description: "Test command",
    })
      .addOption(
        Option.create({
          flag: "-t, --test",
          description: "Test option",
          defaultValue: "test",
        }),
        Option.create({
          flag: "-f, --flag",
          description: "Test flag",
        })
      )
      .addSubcommand(
        Command.create({
          name: "subcommand",
          description: "Test subcommand",
        })
      );

    command.help();

    expect(consoleInfoSpy).toHaveBeenCalledTimes(6);
    expect(consoleInfoSpy).toHaveBeenCalledWith("test: Test command");
    expect(consoleInfoSpy).toHaveBeenCalledWith("  Options:");
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "    -t, --test: Test option (default: test)"
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith("    -f, --flag: Test flag");
    expect(consoleInfoSpy).toHaveBeenCalledWith("  Commands:");
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "    subcommand: Test subcommand"
    );

    consoleInfoSpy.mockRestore();
  });
});
