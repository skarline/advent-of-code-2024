import { assertEquals } from "@std/assert";

type Point = {
  x: number;
  y: number;
};

function parse(input: string) {
  const matrix = input.trim().split("\n").map((line) => line.split(""));
  const width = matrix[0].length, height = matrix.length;

  let start: Point | null = null;
  let end: Point | null = null;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == "S") start = { x, y };
      if (matrix[y][x] == "E") end = { x, y };
    }
  }

  if (!start || !end) throw new Error("Failed to parse input");

  return { matrix, width, height, start, end };
}

const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function createPath(
  matrix: string[][],
  start: Point,
) {
  const width = matrix[0].length;
  const path: Point[] = [];
  const visited = new Set<number>();

  let current = start;

  while (true) {
    path.push(current);
    visited.add(current.y * width + current.x);

    const neighbors = directions.map<Point>(
      ([dx, dy]) => ({ x: current.x + dx, y: current.y + dy }),
    );

    const next = neighbors.find((point) => {
      if (visited.has(point.y * width + point.x)) return false;
      if (matrix[point.y][point.x] == "#") return false;
      return true;
    });

    if (!next) break;
    current = next;
  }

  return path;
}

export function part1(input: string, threshold = 100) {
  const { matrix, width, height, start } = parse(input);

  const path = createPath(matrix, start);

  return path
    .slice(0, -1)
    .reduce((acc, { x, y }, i) => {
      return acc + directions.filter(([dx, dy]) => {
        const distance = 2;
        const nx = x + dx * distance, ny = y + dy * distance;
        if (nx < 1 || nx > width - 2) return false;
        if (ny < 1 || ny > height - 2) return false;
        if (matrix[ny][nx] == "#") return false;

        const j = path.findIndex((point) => point.x == nx && point.y == ny);
        const difference = j - i - distance;

        return difference >= threshold;
      }).length;
    }, 0);
}

export function part2(input: string, threshold = 100) {
  const { matrix, start } = parse(input);

  const path = createPath(matrix, start);

  return path
    .slice(0, -1)
    .reduce((acc, a, i) =>
      acc + path.filter((b, j) => {
        const distance = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
        if (distance <= 20) {
          const difference = j - i - distance;
          return difference >= threshold;
        }
        return false;
      }).length, 0);
}

const exampleInput = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput, 1), 44));
Deno.test("Part 2", () => assertEquals(part2(exampleInput, 50), 285));
