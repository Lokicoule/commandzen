import { paddingRight } from "../../lib/utils/padding";

describe("padding", () => {
  describe("paddingRight", () => {
    it("should pad the text to the right", () => {
      expect(paddingRight("foo", 5)).toBe("foo  ");
    });
  });
});
