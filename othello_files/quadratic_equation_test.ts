import { expect } from "jsr:@std/expect";
import { solve } from "./quadratic_equation.ts";

Deno.test("solve returns two solutions when D > 0", () => {
  const result = solve(1, -3, 2);
  expect(result).toEqual([2, 1]);
});

Deno.test("solve returns one solution when D = 0", () => {
  const result = solve(1, -2, 1);
  expect(result).toEqual([1]);
});

Deno.test("solve returns empty array when D < 0", () => {
  const result = solve(1, 0, 1);
  expect(result).toEqual([]);
});