const utils = require("../../server/utils");

test("empty query gets param b=b and outputs ?b=b", () => {
  expect(utils.addQueryParam("", "b=b")).toBe("?b=b");
});

test("calling without query should throw error", () => {
  expect(() => utils.addQueryParam()).toThrowError(
    "query cannot be null or undefined"
  );
});

test("calling without param should throw error", () => {
  expect(() => utils.addQueryParam("test")).toThrowError(
    "param is required"
  );
});

test("calling with query that has ? should not add another", () => {
  expect(utils.addQueryParam("?b=b", "c=c")).toBe("?b=b&c=c");
});
