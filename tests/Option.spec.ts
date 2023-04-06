/* import { Option } from "../lib/option/Option";

describe("Option", () => {
  describe("constructor", () => {
    it("should parse the flag and set the appropriate properties", () => {
      const option = new Option({
        flag: "-f, --foo [bar]",
        description: "An example option.",
      });
      expect(option.flag).toEqual("-f, --foo [bar]");
      expect(option.description).toEqual("An example option.");
      expect(option.defaultValue).toBeUndefined();
      expect(option.required).toEqual(false);
      expect(option.shortName).toEqual("-f");
      expect(option.longName).toEqual("--foo");
      expect(option.key).toEqual("foo");
    });

    it("should handle options without a short name", () => {
      const option = new Option({
        flag: "--long-option",
        description: "An example option.",
      });
      expect(option.shortName).toEqual("");
      expect(option.longName).toEqual("--long-option");
      expect(option.key).toEqual("longOption");
    });

    it("should handle options without a long name", () => {
      const option = new Option({
        flag: "-s",
        description: "An example option.",
      });

      expect(option.shortName).toEqual("-s");
      expect(option.longName).toEqual("");
      expect(option.key).toEqual("s");
    });

    it("should handle required options", () => {
      const option = new Option({
        flag: "--required <value>",
        description: "An example option.",
      });
      expect(option.required).toEqual(true);
    });

    it("should handle options with a default value", () => {
      const option = new Option({
        flag: "-f, --foo <bar>",
        description: "An example option.",
        defaultValue: "baz",
      });
      expect(option.defaultValue).toEqual("baz");
    });
  });

  describe("create", () => {
    it("should return a new instance of the Option class", () => {
      const option = Option.create({
        flag: "-f, --foo [bar]",
        description: "An example option.",
      });
      expect(option instanceof Option).toEqual(true);
      expect(option.flag).toEqual("-f, --foo [bar]");
    });
  });

  describe("parseFlag", () => {
    it("should parse short and long name flags correctly", () => {
      const option = new Option({
        flag: "-f, --foo-bar",
        description: "foo option",
      });

      expect(option.shortName).toBe("-f");
      expect(option.longName).toBe("--foo-bar");
    });

    it("should parse required key flags correctly", () => {
      const option = new Option({
        flag: "--foo <bar>",
        description: "foo option",
      });
      expect(option.required).toBe(true);
      expect(option.key).toBe("foo");
    });

    it("should parse optional key flags correctly", () => {
      const option = new Option({
        flag: "--foo [bar]",
        description: "foo option",
      });
      expect(option.required).toBe(false);
      expect(option.key).toBe("foo");
    });

    test("should use long name as key and use camel case", () => {
      const option = new Option({
        flag: "--foo-bar",
        description: "foo option",
      });

      expect(option.key).toBe("fooBar");
    });

    test("should use short name as key", () => {
      const option = new Option({
        flag: "-f",
        description: "foo option",
      });

      expect(option.key).toBe("f");
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

    test("should handle array default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: [1, 2, 3],
      });
      expect(option.defaultValue).toEqual([1, 2, 3]);
    });

    test("should handle object default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: { foo: "bar" },
      });
      expect(option.defaultValue).toEqual({ foo: "bar" });
    });

    test("should handle boolean default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: true,
      });
      expect(option.defaultValue).toBe(true);
    });

    test("should handle string default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: "bar",
      });
      expect(option.defaultValue).toBe("bar");
    });

    test("should handle number default value", () => {
      const option = new Option({
        flag: "--foo",
        description: "foo option",
        defaultValue: 42,
      });
      expect(option.defaultValue).toBe(42);
    });

    test("should handle short name with dash", () => {
      const option = new Option({
        flag: "-f, --foo-bar",
        description: "foo option",
      });
      expect(option.key).toBe("fooBar");
    });
  });
});
 */
