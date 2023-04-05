import { Option } from "../option/Option";
import { ParsedOptions } from "./CommandParser";

export type CommandProperties<T = ParsedOptions> = {
  name: string;
  description?: string;
  aliases?: string[];
  options?: Option[];
  action?: (options: T) => void | Promise<void>;
};

export class Command<T = ParsedOptions> {
  constructor(private readonly properties: CommandProperties<T>) {}

  public static create<T = ParsedOptions>(
    properties: CommandProperties<T>
  ): Command<T> {
    return new Command<T>(properties);
  }

  public addOption(option: Option): Command<T> {
    if (!this.properties.options) {
      this.properties.options = [];
    }

    this.properties.options.push(option);

    return this as Command<T>;
  }

  public async execute(options: T): Promise<void> {
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

  public get action(): ((options: T) => void | Promise<void>) | undefined {
    return this.properties.action;
  }

  public set action(
    action: ((options: T) => void | Promise<void>) | undefined
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
