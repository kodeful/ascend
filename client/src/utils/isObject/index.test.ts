import { isObject } from "./index";

describe("isObject function should return", () => {
  test("true for {}", () => {
    expect(isObject({})).toBe(true);
  });

  test("true for { test: true }", () => {
    expect(isObject({ test: true })).toBe(true);
  });

  test("false for []", () => {
    expect(isObject([])).toBe(false);
  });

  test("false for string", () => {
    expect(isObject("test")).toBe(false);
  });

  test("false for number", () => {
    expect(isObject(2)).toBe(false);
  });

  test("false for function", () => {
    expect(isObject(() => {})).toBe(false);
  });
});
