import { OptionConfig } from "./OptionConfig";

export type CommandConfigProperties = {
  name: string;
  description?: string;
  aliases?: string[];
  options?: OptionConfig[];
};

export class CommandConfig {
  constructor(private readonly properties: CommandConfigProperties) {}

  public get name(): string {
    return this.properties.name;
  }

  public get description(): string | undefined {
    return this.properties.description;
  }

  public get aliases(): string[] | undefined {
    return this.properties.aliases;
  }

  public get options(): OptionConfig[] | undefined {
    return this.properties.options;
  }

  public set options(options: OptionConfig[] | undefined) {
    this.properties.options = options;
  }

  public findOption(shortName: string): OptionConfig | undefined {
    return this.properties.options?.find(
      (option) => option.shortName === shortName
    );
  }
}
