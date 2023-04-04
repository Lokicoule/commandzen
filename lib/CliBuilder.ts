import { EventEmitter } from "events";

export class Command extends EventEmitter {
  name: string;
  description: string;
  options: Option[];
  commands: Command[];

  constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
    this.options = [];
    this.commands = [];
  }

  addOption(option: Option): Command {
    this.options.push(option);
    return this;
  }

  addCommand(command: Command): Command {
    this.commands.push(command);
    return this;
  }

  parse(args: string[]): void {
    // TODO: Implement
  }
}

export class Option {
  flag: string;
  description: string;
  required: boolean;

  constructor(flag: string, description: string, required = false) {
    this.flag = flag;
    this.description = description;
    this.required = required;
  }
}

export class CliBuilder {
  rootCommand: Command;

  constructor() {
    this.rootCommand = new Command("", "");
  }

  command(name: string, description: string): Command {
    const command = new Command(name, description);
    this.rootCommand.addCommand(command);
    return command;
  }

  parse(args: string[]): void {
    this.rootCommand.parse(args);
  }
}
