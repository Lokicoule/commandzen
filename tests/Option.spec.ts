import { Option } from "../lib/Option";

describe("Option", () => {
  describe("constructor", () => {
    it("should set the flag, description, and defaultValue properties correctly", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: "bar",
      });
      expect(option.flag).toBe("--foo");
      expect(option.description).toBe("foo option");
      expect(option.defaultValue).toBe("bar");
    });
  });

  describe("parseFlag", () => {
    it("should parse short and long name flags correctly", () => {
      const option = new Option({
        flag: "-f, --foo",
        description: "foo option",
      });

      expect(option.shortName).toBe("-f");
      expect(option.longName).toBe("--foo");
    });

    it("should parse required key flags correctly", () => {
      const option = new Option({
        flag: "--foo <bar>",
        description: "foo option",
      });
      expect(option.required).toBe(true);
      expect(option.key).toBe("bar");
    });

    it("should parse optional key flags correctly", () => {
      const option = new Option({
        flag: "--foo [bar]",
        description: "foo option",
      });
      expect(option.required).toBe(false);
      expect(option.key).toBe("bar");
    });

    it("should handle no key flags correctly", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
      });
      expect(option.required).toBe(false);
      expect(option.key).toBeUndefined();
    });

    it("should handle no flag correctly", () => {
      const option = new Option({
        flag: "",
        description: "foo option",
      });
      expect(option.required).toBe(false);
      expect(option.key).toBeUndefined();
    });

    test("should handle optional default value", () => {
      const option = new Option({
        flag: "--foo [bar]",
        description: "foo option",
        defaultValue: 42,
      });
      expect(option.defaultValue).toBe(42);
    });

    test("should handle required default value", () => {
      const option = new Option({
        flag: "--foo <bar>",
        description: "foo option",
        defaultValue: 42,
      });
      expect(option.defaultValue).toBe(42);
    });

    test("should handle no default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
      });
      expect(option.defaultValue).toBeUndefined();
    });
  });
});
