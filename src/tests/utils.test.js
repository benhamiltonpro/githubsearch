import { sortByProperty } from "../utils";

test("empty array returns empty", () => {
  const empty = [];
  expect(sortByProperty(empty)).toStrictEqual([]);
});

test("[z,a] becomes [a,z]", () => {
  const input = [{ test: "z" }, { test: "a" }];
  const expected = [{ test: "a" }, { test: "z" }];
  expect(sortByProperty(input, "test")).toStrictEqual(expected);
});

test("[a,z] stays [a,z]", () => {
  const input = [{ test: "a" }, { test: "z" }];
  const expected = [{ test: "a" }, { test: "z" }];
  expect(sortByProperty(input, "test")).toStrictEqual(expected);
});
