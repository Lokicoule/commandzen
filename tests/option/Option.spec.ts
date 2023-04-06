import { Option } from "../../lib";

describe("Option", () => {
  describe("create", () => {
    it("should create an option", () => {
      const option = Option.create({
        flag: "--foo <bar>",
        description: "Some description",
      });

      expect(option).toBeInstanceOf(Option);
    });

    it("should create an option with a default value", () => {
      const option = Option.create({
        flag: "--foo <bar>",
        description: "Some description",
        defaultValue: "bar",
      });

      expect(option).toBeInstanceOf(Option);
    });
  });
});
