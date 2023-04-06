import { Argument } from "../../lib";

describe("Argument", () => {
  describe("create", () => {
    it("should create an argument", () => {
      const argument = Argument.create({
        flag: "<bar>",
        description: "Some description",
      });

      expect(argument).toBeInstanceOf(Argument);
    });
  });
});
