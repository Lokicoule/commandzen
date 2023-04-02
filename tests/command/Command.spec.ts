import { Argument, Command, Option, ParsedOptions } from "../../lib";

describe("Command", () => {
  describe("constructor", () => {
    it("should create a command with the given properties", () => {
      const properties = {
        name: "test",
        description: "Test command",
        aliases: ["t"],
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
            argument: Argument.create({ type: "string" }),
          }),
        ],
        action: () => {},
      };

      const command = new Command(properties);

      expect(command.name).toBe(properties.name);
      expect(command.description).toBe(properties.description);
      expect(command.aliases).toEqual(properties.aliases);
      expect(command.options).toEqual(properties.options);
      expect(command.action).toEqual(properties.action);
    });
  });

  describe("option", () => {
    it("should override the options with new options", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });
      const overrideOption = new Option({
        shortName: "-o",
        longName: "--override",
        description: "Override the last option",
      });
      command.options = [overrideOption];

      expect(command.options).toEqual([overrideOption]);
    });

    it("should clear the options if the new options are undefined", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      command.options = undefined;

      expect(command.options).toEqual([]);
    });
  });

  describe("addOption", () => {
    it("should add an option to the command's options", () => {
      const command = new Command({ name: "test" });

      const option = Option.create({
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      });

      command.addOption(option);
      expect(command.options).toEqual([option]);
    });

    it("should return the command instance", () => {
      const command = new Command({ name: "test" });

      const option = new Option({
        shortName: "-f",
        longName: "--file",
        description: "Specify the input file",
        argument: Argument.create({ type: "string" }),
      });

      const result = command.addOption(option);

      expect(result).toBe(command);
    });
  });

  describe("execute", () => {
    describe("execute", () => {
      it("should execute a synchronous action", () => {
        let actionExecuted = false;
        const syncAction = (options: ParsedOptions) => {
          actionExecuted = true;
        };

        const command = new Command({
          name: "sync",
          action: syncAction,
        });

        command.execute({});

        expect(actionExecuted).toBe(true);
      });

      it("should execute an asynchronous action", async () => {
        let actionExecuted = false;
        const asyncAction = async (options: ParsedOptions) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              actionExecuted = true;
              resolve();
            }, 100);
          });
        };

        const command = new Command({
          name: "async",
          action: asyncAction,
        });

        await command.execute({});

        expect(actionExecuted).toBe(true);
      });
    });
  });

  describe("findOption", () => {
    it("should return the option with the given short name", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      const option = command.findOption("f");

      expect(option?.shortName).toBe("-f");
    });

    it("should return undefined if no option with the given short name exists", () => {
      const command = new Command({
        name: "test",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
          }),
        ],
      });

      const option = command.findOption("-u");

      expect(option).toBeUndefined();
    });
  });

  describe("getHelp", () => {
    it("should return the command's help text", () => {
      const command = new Command({
        name: "test",
        description: "Test command",
        options: [
          new Option({
            shortName: "-f",
            longName: "--file",
            description: "Specify the input file",
            argument: Argument.create({ type: "string", required: true }),
          }),
          new Option({
            shortName: "-v",
            longName: "--verbose",
            description: "Enable verbose logging",
          }),
        ],
      });

      const help = command.getHelp();

      expect(help).toEqual(
        "test\n  Test command\n  Options:\n    -f, --file <string>, Specify the input file\n    -v, --verbose, Enable verbose logging\n"
      );
    });
  });

  describe("action", () => {
    it("should return the action function", () => {
      const action = () => {};
      const command = new Command({ name: "test", action });

      expect(command.action).toBe(action);
    });

    it("should set the action function", () => {
      const command = new Command({ name: "test" });
      const action = () => {};

      command.action = action;

      expect(command.action).toBe(action);
    });
  });
});
