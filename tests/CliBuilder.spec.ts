import { CliBuilder, Command } from "../lib";

describe("CliBuilder", () => {
  const defaultCommandProps = {
    name: "test",
    description: "Test command",
  };

  it("should create a new CliBuilder instance", () => {
    const cliBuilder = CliBuilder.create(defaultCommandProps);
    expect(cliBuilder).toBeInstanceOf(CliBuilder);
  });

  it("should add a command to the CLI", () => {
    const command = Command.create({
      name: "subcommand",
      description: "Subcommand description",
    });

    const cliBuilder = CliBuilder.create(defaultCommandProps);
    cliBuilder.addCommand(command);

    const foundCommand =
      cliBuilder["defaultCommand"].findSubcommand("subcommand");
    expect(foundCommand).toBe(command);
  });

  it("should add an option to the default command", () => {
    const optionProps = {
      flag: "-f, --flag",
      description: "Test flag",
    };

    const cliBuilder = CliBuilder.create(defaultCommandProps);
    cliBuilder.addOption(optionProps);

    const option = cliBuilder["defaultCommand"].findOption("-f");
    expect(option.flag).toBe(optionProps.flag);
    expect(option.description).toBe(optionProps.description);
  });

  it("should set a new default command", () => {
    const newDefaultCommand = Command.create({
      name: "newDefault",
      description: "New default command",
    });

    const cliBuilder = CliBuilder.create(defaultCommandProps);
    cliBuilder.setDefaultCommand(newDefaultCommand);

    expect(cliBuilder["defaultCommand"]).toBe(newDefaultCommand);
  });

  describe("help action", () => {
    let consoleWarnSpy: jest.SpyInstance;
    let helpSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      helpSpy = jest.spyOn(Command.prototype, "help").mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
      helpSpy.mockRestore();
    });

    it("should call help on the default command if no command is specified", () => {
      const cliBuilder = CliBuilder.create(defaultCommandProps);

      cliBuilder.parse(["help"]);

      expect(helpSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("should call help on a subcommand if it exists", () => {
      const subcommand = Command.create({
        name: "subcommand",
        description: "Subcommand description",
      });

      const cliBuilder = CliBuilder.create(defaultCommandProps);
      cliBuilder.addCommand(subcommand);

      cliBuilder.parse(["help", "-c", "subcommand"]);

      expect(helpSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("should display a warning if the specified command does not exist", () => {
      const cliBuilder = CliBuilder.create(defaultCommandProps);

      cliBuilder.parse(["help", "-c", "nonexistent"]);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Command 'nonexistent' not found."
      );
    });
  });
});
