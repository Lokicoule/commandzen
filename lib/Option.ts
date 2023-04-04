export interface OptionProps {
  flag: string;
  description: string;
  defaultValue?: unknown;
}

interface PrivateOptionProps {
  shortName?: string;
  longName?: string;
  key?: string;
  required?: boolean;
}

export type OptionState = OptionProps & PrivateOptionProps;

export class Option {
  private readonly state: OptionState;

  constructor({ flag, description, defaultValue }: OptionProps) {
    this.state = {
      flag,
      description,
      defaultValue,
      required: false,
    };
    this.parseFlag();
  }

  get flag(): string {
    return this.state.flag;
  }

  get description(): string {
    return this.state.description;
  }

  get defaultValue(): unknown | undefined {
    return this.state.defaultValue;
  }

  get required(): boolean | undefined {
    return this.state.required;
  }

  get shortName(): string | undefined {
    return this.state.shortName;
  }

  get longName(): string | undefined {
    return this.state.longName;
  }

  get key(): string | undefined {
    return this.state.key;
  }

  private parseFlag(): void {
    const flagPattern = /(-\w+)|(--\w+)/g;
    const flagMatches = [...this.flag.matchAll(flagPattern)];

    flagMatches.forEach(([_, shortName, longName]) => {
      if (shortName) {
        this.state.shortName = shortName;
      } else if (longName) {
        this.state.longName = longName;
      }
    });

    const keyPattern = /<(\w+)>|\[(\w+)\]/;
    const keyMatch = this.flag.match(keyPattern);

    if (keyMatch) {
      const [, requiredKey, optionalKey] = keyMatch;
      this.state.required = !!requiredKey;
      this.state.key = requiredKey || optionalKey;
    }
  }
}
