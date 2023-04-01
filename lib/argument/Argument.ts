export type ArgumentType = "string" | "number" | "boolean";

export type ArgumentValue = string | number | boolean;

export type ArgumentProperties = {
  type: ArgumentType;
  required?: boolean;
  defaultValue?: ArgumentValue;
};

export class Argument {
  constructor(private readonly properties: ArgumentProperties) {}

  public static create(properties: ArgumentProperties): Argument {
    return new Argument(properties);
  }

  public get type(): ArgumentType {
    return this.properties.type;
  }

  public get required(): boolean {
    return this.properties.required ?? false;
  }

  public get defaultValue(): ArgumentValue | undefined {
    return this.properties.defaultValue;
  }
}
