import { assertEquals } from "@std/assert";
import { range } from "https://cdn.skypack.dev/lodash-es";

function parseMatrix(input: string) {
  return input.split("\n")
    .filter((s) => s.length)
    .map((s) => s.split(""));
}

function segmentAndEvaluateRegions(matrix: string[][]) {
  const width = matrix[0].length;
  const height = matrix.length;

  const labelMatrix = range(height).map(() => range(width).map(() => 0));
  let label = 1;

  const perimeterMap: Record<string, number> = {};
  const areaMap: Record<string, number> = {};
  const sidesMap: Record<string, number> = {};

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const regionType = matrix[y][x];
      const queue: Point[] = [];

      if (!labelMatrix[y][x]) {
        queue.push([x, y]);
      }

      while (queue.length) {
        const [x, y] = queue.pop()!;
        if (matrix[y]?.[x] != regionType) continue;
        if (labelMatrix[y]?.[x]) continue;

        labelMatrix[y][x] = label;

        perimeterMap[label] ??= 0;
        areaMap[label] ??= 0;
        sidesMap[label] ??= 0;

        areaMap[label]++;

        const neighborOffsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const neighbors = neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

        for (const [x, y] of neighbors) {
          if (matrix[y]?.[x] != regionType) perimeterMap[label]++;
          queue.push([x, y]);
        }

        const cornerTests = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        sidesMap[label] += cornerTests.reduce((acc, [dx, dy]) => {
          const concave = matrix[y]?.[x + dx] != regionType &&
            matrix[y + dy]?.[x] != regionType;

          const convex = matrix[y + dy]?.[x + dx] != regionType &&
            matrix[y]?.[x + dx] == regionType &&
            matrix[y + dy]?.[x] == regionType;

          return acc + Number(concave) + Number(convex);
        }, 0);
      }

      label++;
    }
  }

  type Result = {
    [key: string]: {
      perimeter: number;
      area: number;
      sides: number;
    };
  };

  return Object.keys(perimeterMap).reduce<Result>((res, key) => {
    return {
      ...res,
      [key]: {
        perimeter: perimeterMap[key],
        area: areaMap[key],
        sides: sidesMap[key],
      },
    };
  }, {});
}

type Point = [number, number];

export function part1(input: string) {
  return Object.values(
    segmentAndEvaluateRegions(parseMatrix(input)),
  ).reduce(
    (acc, { perimeter, area }) => acc + perimeter * area,
    0,
  );
}

export function part2(input: string) {
  return Object.values(
    segmentAndEvaluateRegions(parseMatrix(input)),
  ).reduce(
    (acc, { area, sides }) => acc + area * sides,
    0,
  );
}

const exampleInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 1930));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 1206));
