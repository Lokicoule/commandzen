import { Option } from "../option/Option";
import { ParsedOptions } from "./CommandParser";

export type CommandProperties = {
  name: string;
  description?: string;
  aliases?: string[];
  options?: Option[];
  action?: (options: Record<string, any>) => void | Promise<void>;
};

export class Command {
  constructor(private readonly properties: CommandProperties) {}

  public static create(properties: CommandProperties): Command {
    return new Command(properties);
  }

  public addOption(option: Option): Command {
    if (!this.properties.options) {
      this.properties.options = [];
    }

    this.properties.options.push(option);

    return this;
  }

  public async execute(options: ParsedOptions): Promise<void> {
    if (this.action) {
      const result = this.action(options);
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  public get name(): string {
    return this.properties.name;
  }

  public get description(): string | undefined {
    return this.properties.description;
  }

  public get aliases(): string[] | undefined {
    return this.properties.aliases;
  }

  public get action():
    | ((options: Record<string, any>) => void | Promise<void>)
    | undefined {
    return this.properties.action;
  }

  public set action(
    action: ((options: Record<string, any>) => void | Promise<void>) | undefined
  ) {
    this.properties.action = action;
  }

  public get options(): Option[] {
    return this.properties.options ?? [];
  }

  public set options(options: Option[]) {
    this.properties.options = options ?? [];
  }

  public findOption(name: string): Option | undefined {
    return this.properties.options?.find(
      (option) =>
        option.shortName === `-${name}` ||
        option?.longName === `--${name}` ||
        option.shortName === name ||
        option?.longName === name
    );
  }

  public getHelp(): string {
    let help = `${this.name}\n  ${this.description}\n`;

    if (this.options.length > 0) {
      help += "  Options:\n";
      this.options.forEach((option) => {
        const optionStr = [
          option.shortName,
          option.argument?.type
            ? [
                option.longName,
                option.argument?.required
                  ? `<${option.argument.type}>`
                  : `[${option.argument?.type}]`,
              ].join(" ")
            : option.longName,
          option.description,
        ]
          .filter(Boolean)
          .join(", ");
        help += `    ${optionStr}\n`;
      });
    }

    return help;
  }
}
