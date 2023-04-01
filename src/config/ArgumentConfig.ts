/**
 * @type ArgumentType
 * @description
 * The ArgumentType is used to define the type of an argument.
 */
export type ArgumentType = "string" | "number" | "boolean";

/**
 * @type ArgumentValue
 * @description
 * The ArgumentValue is used to define the type of the default value of an argument.
 */
export type ArgumentValue = string | number | boolean;

/**
 * @type ArgumentConfig
 * @description
 * The ArgumentConfig type is used to define the argument for an option.
 * An argument can be required or not.
 * An argument can be of type string, number or boolean.
 */
export type ArgumentConfig = {
  type: ArgumentType;
  required?: boolean;
  defaultValue?: ArgumentValue;
};
