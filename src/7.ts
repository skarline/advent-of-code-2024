import { assertEquals } from "@std/assert";
import { cartesian } from "./utils.ts";
import { range } from "https://cdn.skypack.dev/lodash-es";

function parseEquations(input: string) {
  return input
    .split("\n")
    .filter((s) => s.length)
    .map((s) => {
      const [left, right] = s.split(":");
      const test = Number(left);
      const nums = right.split(" ").filter((s) => s.length).map(Number);
      return { test, nums };
    });
}

enum Operator {
  Add,
  Multiply,
  Concat,
}

export function part1(input: string) {
  const map = new Map<number, Operator[][]>();
  const ops = [Operator.Add, Operator.Multiply];
  const getCombinations = (n: number) => {
    if (!map.has(n)) map.set(n, cartesian(...range(n - 1).map(() => ops)));
    return map.get(n)!;
  };

  return parseEquations(input).reduce(
    (acc, eq) =>
      getCombinations(eq.nums.length).some(
          (ops) =>
            ops.reduce((a, op, i) => {
              const b = eq.nums[i + 1];
              if (op == Operator.Add) return a + b;
              if (op == Operator.Multiply) return a * b;
              return a;
            }, eq.nums[0]) == eq.test,
        )
        ? acc + eq.test
        : acc,
    0,
  );
}

export function part2(input: string) {
  const map = new Map<number, Operator[][]>();
  const ops = [Operator.Add, Operator.Multiply, Operator.Concat];
  const getCombinations = (n: number) => {
    if (!map.has(n)) {
      map.set(
        n,
        cartesian(...range(n - 1).map(() => ops)).sort((a, b) => {
          // Concat is expensive, so we want to do it last
          return a.indexOf(Operator.Concat) - b.indexOf(Operator.Concat);
        }),
      );
    }
    return map.get(n)!;
  };

  return parseEquations(input).reduce(
    (acc, eq) =>
      getCombinations(eq.nums.length).some(
          (ops) =>
            ops.reduce((a, op, i) => {
              const b = eq.nums[i + 1];
              if (op == Operator.Add) return a + b;
              if (op == Operator.Multiply) return a * b;
              if (op == Operator.Concat) {
                return (a * Math.pow(10, Math.floor(Math.log10(b)) + 1)) + b;
              }
              return a;
            }, eq.nums[0]) == eq.test,
        )
        ? acc + eq.test
        : acc,
    0,
  );
}

const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 3749));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 11387));
