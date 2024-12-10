import { assertEquals } from "@std/assert";
import { cartesian } from "./utils.ts";
import { range } from "https://cdn.skypack.dev/lodash-es";

function parseInput(input: string) {
  const map = input
    .split("\n")
    .filter((s) => s.length)
    .map((s) => s.split("").map(Number));

  const width = map[0].length;
  const height = map.length;

  return { map, width, height };
}

function computePossibleTrailEnds(
  x: number,
  y: number,
  map: number[][],
): [number, number][] {
  const h = map[y][x];
  if (h == 9) return [[x, y]];

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  return directions.reduce<[number, number][]>((acc, [dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (map[ny]?.[nx] != h + 1) return acc;
    return acc.concat(computePossibleTrailEnds(nx, ny, map));
  }, []);
}

export function part1(input: string) {
  const { map, width, height } = parseInput(input);

  return cartesian(range(width), range(height))
    .filter(([x, y]) => map[y][x] == 0)
    .reduce((acc, [x, y]) =>
      acc + new Set(
        computePossibleTrailEnds(x, y, map).map(([x, y]) => y * width + x),
      ).size, 0);
}

export function part2(input: string) {
  const { map, width, height } = parseInput(input);

  return cartesian(range(width), range(height))
    .filter(([x, y]) => map[y][x] == 0)
    .reduce(
      (acc, [x, y]) => acc + computePossibleTrailEnds(x, y, map).length,
      0,
    );
}

const exampleInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 36));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 81));
