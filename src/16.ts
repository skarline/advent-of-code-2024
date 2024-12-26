import { assertEquals } from "@std/assert";
import { range } from "https://cdn.skypack.dev/lodash-es";

type Point = {
  x: number;
  y: number;
};

enum Direction {
  West,
  East,
  North,
  South,
}

type DirectionCostMap = Map<Direction, number>;

const directionVectors = new Map<Direction, [number, number]>([
  [Direction.West, [-1, 0]],
  [Direction.East, [1, 0]],
  [Direction.North, [0, -1]],
  [Direction.South, [0, 1]],
]);

function parse(input: string) {
  const matrix = input
    .trim()
    .split("\n")
    .map((row) => row.split(""));

  let start: Point | null = null;
  let end: Point | null = null;

  matrix.forEach((row, y) =>
    row.forEach((char, x) => {
      if (char == "S") start = { x, y };
      if (char == "E") end = { x, y };
    })
  );

  return { matrix, start: start!, end: end! };
}

function createCostMatrix(matrix: string[][], start: Point) {
  const w = matrix[0].length, h = matrix.length;

  const costMatrix: DirectionCostMap[][] = range(h).map(() =>
    range(w).map(() => new Map())
  );

  function propagate(
    x: number,
    y: number,
    cost: number,
    currentDirection: Direction,
  ) {
    for (const [direction, [dx, dy]] of directionVectors.entries()) {
      const nx = x + dx, ny = y + dy;
      if (matrix[ny][nx] == "#") continue;

      const turnCost = currentDirection != direction ? 1000 : 0;
      const newCost = cost + turnCost + 1;

      if (newCost < (costMatrix[ny][nx].get(direction) || Infinity)) {
        costMatrix[ny][nx].set(direction, newCost);
        propagate(nx, ny, newCost, direction);
      }
    }
  }

  costMatrix[start.y][start.x].set(Direction.East, 0);
  propagate(start.x, start.y, 0, Direction.East);

  return costMatrix;
}

export function part1(input: string) {
  const { matrix, start, end } = parse(input);

  const costMatrix = createCostMatrix(matrix, start);

  return Math.min(...costMatrix[end.y][end.x].values());
}

export function part2(input: string) {
  const { matrix, start, end } = parse(input);
  const width = matrix[0].length;

  const costMatrix = createCostMatrix(matrix, start);

  const tiles = new Set<number>();

  function backtrack(
    x: number,
    y: number,
    currentCost: number,
    currentDirection: Direction,
  ) {
    const index = y * width + x;
    const map = costMatrix[y][x];

    for (const [direction, cost] of map.entries()) {
      const turnCost = currentDirection != direction ? 1000 : 0;
      if (cost <= currentCost - turnCost) {
        tiles.add(index);
        const [dx, dy] = directionVectors.get(direction)!;
        const nx = x - dx, ny = y - dy;
        backtrack(nx, ny, cost - 1, direction);
      }
    }
  }

  const bestCost = Math.min(...costMatrix[end.y][end.x].values());

  for (const direction of costMatrix[end.y][end.x].keys()) {
    backtrack(end.x, end.y, bestCost, direction);
  }

  return tiles.size;
}

const example1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`;

const example2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`;

Deno.test("Part 1 (1)", () => assertEquals(part1(example1), 7036));
Deno.test("Part 1 (2)", () => assertEquals(part1(example2), 11048));
Deno.test("Part 2 (1)", () => assertEquals(part2(example1), 45));
Deno.test("Part 2 (2)", () => assertEquals(part2(example2), 64));
