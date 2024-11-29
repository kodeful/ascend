import { isEmptyObject } from "./index";

test("should return false for not empty object", () => {
  expect(isEmptyObject({ notEmpty: "yes" })).toBe(false);
});

test("should return true for empty object", () => {
  expect(isEmptyObject({})).toBe(true);
});

test("should return true Object.assign with null", () => {
  expect(isEmptyObject(Object.assign({}, null))).toBe(true);
});
