import { Argument } from "../argument/Argument";

export type OptionProperties = {
  shortName: string;
  longName?: string;
  description?: string;
  argument?: Argument;
};

export class Option {
  constructor(private readonly properties: OptionProperties) {}

  public static create(properties: OptionProperties): Option {
    return new Option(properties);
  }

  public get shortName(): string {
    return this.properties.shortName;
  }

  public get longName(): string | undefined {
    return this.properties.longName;
  }

  public get description(): string | undefined {
    return this.properties.description;
  }

  public get argument(): Argument | undefined {
    return this.properties.argument;
  }

  public set argument(argument: Argument | undefined) {
    this.properties.argument = argument;
  }

  public getKey(): string {
    return this.longName
      ? this.longName.replace(/^--/, "")
      : this.shortName.replace(/^-/, "");
  }
}
