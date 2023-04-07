import { Command, CommandRunner } from "../../lib";

describe("CommandRunner", () => {
  let command: Command;
  let actionHandler: jest.Mock;

  beforeEach(() => {
    actionHandler = jest.fn();
    command = Command.create({ name: "test", description: "Test command" });
    command.registerAction(actionHandler);
  });

  it("should call registered action handler when running command", () => {
    CommandRunner.run(command, {});

    expect(actionHandler).toHaveBeenCalled();
  });

  it("should call help() and exit process when help option is provided", () => {
    const helpSpy = jest.spyOn(command, "help");
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();
    const argv = { help: true };

    CommandRunner.run(command, argv);

    expect(helpSpy).toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(0);

    processExitSpy.mockRestore();
  });
});
