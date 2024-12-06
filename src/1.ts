import { assertEquals } from "@std/assert";

function parseInput(input: string) {
  const pairs = input
    .split("\n")
    .filter((line) => line.length)
    .map((line) => line.split(/\s+/).map(Number));

  const left = pairs.map((pair) => pair[0]).sort();
  const right = pairs.map((pair) => pair[1]).sort();

  return { left, right };
}

export function part1(input: string) {
  const { left, right } = parseInput(input);

  const totalDistance = left.reduce(
    (acc, _, i) => acc + Math.abs(left[i] - right[i]),
    0,
  );

  return totalDistance;
}

export function part2(input: string) {
  const { left, right } = parseInput(input);

  const similarityScore = left.reduce(
    (acc, curr) => {
      const ocurrences = right.filter((n) => n === curr).length;
      return acc + curr * ocurrences;
    },
    0,
  );

  return similarityScore;
}

const exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 11));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 31));
