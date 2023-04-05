import { Command } from "../lib/Command";
import { Option } from "../lib/Option";

describe("Command", () => {
  it("should create a command", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    expect(command.name).toEqual("test");
    expect(command.description).toEqual("Test command");
  });

  it("should add a subcommand", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const subcommand = Command.create({
      name: "subcommand",
      description: "Test subcommand",
    });

    command.addSubcommand(subcommand);

    expect(command.subcommands.has("subcommand")).toBeTruthy();
  });

  it("should add an option", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const option = Option.create({
      flag: "-t, --test",
      description: "Test option",
    });

    command.addOption(option);

    expect(command.options).toHaveLength(1);
  });

  it("should find an option by its flag", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const option = Option.create({
      flag: "-t, --test",
      description: "Test option",
    });

    command.addOption(option);

    expect(command.findOption("-t")).toEqual(option);
    expect(command.findOption("--test")).toEqual(option);
    expect(command.findOption("t")).toEqual(option);
    expect(command.findOption("test")).toEqual(option);
  });

  it("should display help information", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const option = Option.create({
      flag: "-t, --test",
      description: "Test option",
      defaultValue: "test",
    });

    command.addOption(option);

    const subcommand = Command.create({
      name: "subcommand",
      description: "Test subcommand",
    });

    command.addSubcommand(subcommand);

    const spy = jest.spyOn(console, "info").mockImplementation();

    command.help();

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith("test: Test command");
    expect(spy).toHaveBeenCalledWith("  Options:");
    expect(spy).toHaveBeenCalledWith(
      "    -t, --test: Test option (default: test)"
    );
    expect(spy).toHaveBeenCalledWith("  Commands:");
    expect(spy).toHaveBeenCalledWith("    subcommand: Test subcommand");

    spy.mockRestore();
  });

  it("should display help information with a prefix and without default value", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const option = Option.create({
      flag: "-t, --test",
      description: "Test option",
    });

    command.addOption(option);

    const subcommand = Command.create({
      name: "subcommand",
      description: "Test subcommand",
    });

    command.addSubcommand(subcommand);

    const spy = jest.spyOn(console, "info").mockImplementation();

    command.help("\t");

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith("\ttest: Test command");
    expect(spy).toHaveBeenCalledWith("\t  Options:");
    expect(spy).toHaveBeenCalledWith("\t    -t, --test: Test option");
    expect(spy).toHaveBeenCalledWith("\t  Commands:");
    expect(spy).toHaveBeenCalledWith("\t    subcommand: Test subcommand");

    spy.mockRestore();
  });

  it("should emit an event", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const callback = jest.fn();

    command.on("test", callback);

    command.emit("test", {});

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should register an action", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const callback = jest.fn();

    command.registerAction(callback);

    command.emit("test", {});

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should set and get aliases", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    command.addAlias("alias1", "alias2");

    expect(command.aliases).toEqual(["alias1", "alias2"]);
  });

  it("should set and get options", () => {
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    const option1 = Option.create({
      flag: "-t, --test1",
      description: "Test option 1",
    });

    const option2 = Option.create({
      flag: "-u, --test2 <value>",
      description: "Test option 2",
    });

    command.addOption(option1, option2);

    expect(command.options).toEqual([option1, option2]);

    expect(command.findOption("-t")).toEqual(option1);
    expect(command.findOption("--test1")).toEqual(option1);
    expect(command.findOption("t")).toEqual(option1);
    expect(command.findOption("test1")).toEqual(option1);

    expect(command.findOption("-u")).toEqual(option2);
    expect(command.findOption("--test2")).toEqual(option2);
    expect(command.findOption("u")).toEqual(option2);
    expect(command.findOption("test2")).toEqual(option2);

    expect(command.findOption("test")).toBeUndefined();
  });

  it("should emit an event with an alias", () => {
    const callback = jest.fn();
    const rootCommand = Command.create({
      name: "root",
      description: "Root command",
    });
    const command = Command.create({
      name: "test",
      description: "Test command",
    });

    command.addAlias("t");
    command.on("t", callback);
    rootCommand.addSubcommand(command);

    command.emit("t", {});

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
