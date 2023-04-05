import { Command, CommandProps } from "./Command";
import { Option, OptionProps } from "./Option";

export class CliBuilder {
  private defaultCommand: Command;

  constructor({ name, description }: CommandProps) {
    this.defaultCommand = new Command({ name, description });
  }

  public addCommand(props: CommandProps): CliBuilder {
    const command = new Command(props);
    this.defaultCommand.addSubcommand(command);
    return this;
  }

  public addOption(props: OptionProps): CliBuilder {
    const option = new Option(props);
    this.defaultCommand.addOption(option);
    return this;
  }

  public setDefaultCommand(command: Command): CliBuilder {
    this.defaultCommand = command;
    return this;
  }

  public parse(argv: string[] = process.argv.slice(2)): void {
    let command: Command | undefined;

    if (argv.length === 0) {
      command = this.defaultCommand;
    } else {
      const arg = argv.shift()!;
      command = this.defaultCommand.subcommands.get(arg);
      if (!command) {
        argv.unshift(arg);
        command = this.defaultCommand;
      }
    }

    console.log(`Executing command: ${command.name} ${argv.join(" ")}`);
    command.emit(command.name, argv);
  }

  public help(): void {
    console.log("Help");
  }
}
