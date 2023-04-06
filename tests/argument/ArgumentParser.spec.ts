import { ArgumentParser } from "../../lib/argument/ArgumentParser";

describe("ArgumentParser", () => {
  it("should parse a required argument flag", () => {
    const result = ArgumentParser.parse("<requiredArg>");
    expect(result).toEqual({
      key: "requiredArg",
      required: true,
    });
  });

  it("should parse an optional argument flag", () => {
    const result = ArgumentParser.parse("[optionalArg]");
    expect(result).toEqual({
      key: "optionalArg",
      required: false,
    });
  });

  it("should return undefined key and false required for an invalid flag", () => {
    expect(() => ArgumentParser.parse("invalidFlag")).toThrowError(
      "Invalid argument flag"
    );
  });
});
