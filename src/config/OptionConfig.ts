import { ArgumentConfig } from "./ArgumentConfig";

export type OptionConfigProperties = {
  shortName: string;
  longName?: string;
  description?: string;
  argument?: ArgumentConfig;
};

export class OptionConfig {
  constructor(private readonly properties: OptionConfigProperties) {}

  public get shortName(): string {
    return this.properties.shortName;
  }

  public get longName(): string | undefined {
    return this.properties.longName;
  }

  public get description(): string | undefined {
    return this.properties.description;
  }

  public get argument(): ArgumentConfig | undefined {
    return this.properties.argument;
  }

  public getKey(): string {
    return this.longName
      ? this.longName.replace(/^--/, "")
      : this.shortName.replace(/^-/, "");
  }
}
