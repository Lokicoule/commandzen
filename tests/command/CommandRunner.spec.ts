import { ArgvCommand, Command, CommandRunner } from "../../lib";

describe("CommandRunner", () => {
  let command: Command;
  let actionHandler: jest.Mock;

  beforeEach(() => {
    actionHandler = jest.fn();
    command = Command.create({ name: "test", description: "Test command" });
    command.registerAction(actionHandler);
  });

  it("should call registered action handler when running command", () => {
    const argv: ArgvCommand = {
      args: [],
      options: {},
    };

    CommandRunner.run(command, argv);
    expect(actionHandler).toHaveBeenCalled();
  });

  it("should call help() and exit process when help option is provided", () => {
    const helpSpy = jest.spyOn(command, "help");
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    const argv: ArgvCommand = {
      args: [],
      options: { help: true },
    };

    CommandRunner.run(command, argv);
    expect(helpSpy).toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(0);

    processExitSpy.mockRestore();
  });
});
