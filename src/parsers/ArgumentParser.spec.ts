import { CommandConfig } from "src/types";
import { ArgumentParser } from "./ArgumentParser";

describe("ArgumentParser", () => {
  it("should parse arguments", () => {
    const commands = new Map<string, CommandConfig>();
    commands.set("command1", {
      name: "command1",
      options: [
        {
          longName: "option1",
          shortName: "-o1",
          argument: {
            required: true,
            type: "string",
          },
        },
        {
          longName: "option2",
          shortName: "-o2",
          argument: {
            required: true,
            type: "string",
          },
        },
      ],
    });
    commands.set("command2", {
      name: "command2",
      options: [
        {
          longName: "option1",
          shortName: "-o1",
          argument: {
            required: true,
            type: "string",
          },
        },
        {
          longName: "option2",
          shortName: "-o2",
          argument: {
            required: true,
            type: "string",
          },
        },
      ],
    });
    const defaultCommand = {
      name: "default",
      description: "default",
      options: [
        {
          longName: "option1",
          shortName: "-o1",
          description: "option1",
          type: "string",
        },
        {
          longName: "option2",
          shortName: "-o2",
          description: "option2",
          type: "string",
        },
      ],
    };
    const parser = new ArgumentParser(commands, defaultCommand);
    const result = parser.parse(["command1", "-o1", "value1", "-o2", "value2"]);
    expect(result.get("command1")).toEqual({
      option1: "value1",
      option2: "value2",
    });

    const result2 = parser.parse([
      "command2",
      "-o1",
      "value1",
      "-o2",
      "value2",
    ]);
    expect(result2.get("command2")).toEqual({
      option1: "value1",
      option2: "value2",
    });
  });
});
