import { Argument, ArgumentProperties } from "../../lib";

describe("Argument", () => {
  describe("constructor", () => {
    it("should create an argument instance with the specified properties", () => {
      const properties = {
        type: "string",
        required: true,
        defaultValue: "default",
      } as ArgumentProperties;
      const argument = new Argument(properties);
      expect(argument.defaultValue).toEqual(properties.defaultValue);
      expect(argument.required).toEqual(properties.required);
      expect(argument.type).toEqual(properties.type);
    });
  });

  describe("create", () => {
    it("should create an argument instance with the specified properties", () => {
      const properties = {
        type: "number",
        required: false,
      } as ArgumentProperties;
      const argument = Argument.create(properties);
      expect(argument.type).toEqual(properties.type);
      expect(argument.required).toEqual(properties.required);
    });
  });

  describe("type", () => {
    it("should return the argument type", () => {
      const properties = {
        type: "boolean",
        required: true,
      } as ArgumentProperties;
      const argument = Argument.create(properties);
      expect(argument.type).toBe(properties.type);
    });
  });

  describe("required", () => {
    it("should return true if the argument is required", () => {
      const properties = {
        type: "string",
        required: true,
      } as ArgumentProperties;
      const argument = Argument.create(properties);
      expect(argument.required).toBe(true);
    });

    it("should return false if the argument is not required", () => {
      const properties = {
        type: "number",
        required: false,
      } as ArgumentProperties;
      const argument = new Argument(properties);
      expect(argument.required).toBe(false);
    });

    it("should return false if the required property is not specified", () => {
      const properties = { type: "boolean" } as ArgumentProperties;
      const argument = new Argument(properties);
      expect(argument.required).toBe(false);
    });
  });

  describe("defaultValue", () => {
    it("should return the default value if it is specified", () => {
      const properties = {
        type: "string",
        defaultValue: "default",
      } as ArgumentProperties;
      const argument = new Argument(properties);
      expect(argument.defaultValue).toBe(properties.defaultValue);
    });

    it("should return undefined if the default value is not specified", () => {
      const properties = { type: "number" } as ArgumentProperties;
      const argument = new Argument(properties);
      expect(argument.defaultValue).toBe(undefined);
    });
  });
});
