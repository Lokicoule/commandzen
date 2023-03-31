/**
 * @type ArgumentConfig
 * @description
 * The ArgumentConfig type is used to define the argument for an option.
 * An argument can be required or not.
 * An argument can be of type string, number or boolean.
 */
export type ArgumentConfig = {
  type: string;
  required?: boolean;
};

/**
 * @type OptionConfig
 * @description
 * The OptionConfig type is used to define the options for a command.
 * An option can have a short name, which is a single character.
 * An option can have a long name, which is a word.
 * An option can have an argument, which is a value that can be passed to the option.
 */
export type OptionConfig = {
  shortName: string;
  longName?: string;
  argument?: ArgumentConfig;
};

/**
 * @type CommandConfig
 * @description
 * The CommandConfig type is used to define a command.
 * A command is a set of options that can be used to execute a specific task.
 * A command can have aliases, which are other names that can be used to execute the same command.
 * A command can have options, which are used to configure the command.
 */
export type CommandConfig = {
  name: string;
  aliases?: string[];
  options?: OptionConfig[];
};
