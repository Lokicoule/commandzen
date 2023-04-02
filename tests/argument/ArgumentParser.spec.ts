import { Argument, ArgumentValue } from "../../lib";
import { ArgumentParser } from "../../lib/argument/ArgumentParser";

describe("ArgumentParser", () => {
  const testCases: Array<[Argument, string, ArgumentValue]> = [
    [
      Argument.create({ type: "string", defaultValue: undefined }),
      "testString",
      "testString",
    ],
    [Argument.create({ type: "number", defaultValue: undefined }), "42", 42],
    [Argument.create({ type: "number", defaultValue: 0 }), "NaN", 0],
    [
      Argument.create({ type: "boolean", defaultValue: undefined }),
      "true",
      true,
    ],
    [
      Argument.create({ type: "boolean", defaultValue: undefined }),
      "false",
      false,
    ],
  ];

  test.each(testCases)(
    "should parse argument with type %s and value %s correctly",
    (argument: Argument, value: string, expected: ArgumentValue) => {
      const result = ArgumentParser.parse(argument, value);
      expect(result).toEqual(expected);
    }
  );

  test("should throw error on unknown type", () => {
    const argument: Argument = Argument.create({
      type: "unknown",
      defaultValue: undefined,
    } as any);
    const value = "test";
    expect(() => ArgumentParser.parse(argument, value)).toThrowError(
      "Unknown type: unknown"
    );
  });
});
