import { assertEquals } from "@std/assert";
import { clone } from "https://cdn.skypack.dev/lodash-es";
import { hash } from "./utils.ts";

type Vec2 = { x: number; y: number };
type Guard = { position: Vec2; direction: Direction };
enum Direction {
  LEFT,
  RIGHT,
  DOWN,
  UP,
}

function parseInput(input: string) {
  const map = input
    .split("\n")
    .filter((s) => s.length)
    .map((s) => s.split(""));

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == "^") {
        return {
          map,
          guard: <Guard> { direction: Direction.UP, position: { x, y } },
        };
      }
    }
  }

  throw new Error();
}

function getDirectionVector(direction: Direction): Vec2 {
  switch (direction) {
    case Direction.LEFT:
      return { x: -1, y: 0 };
    case Direction.RIGHT:
      return { x: 1, y: 0 };
    case Direction.UP:
      return { x: 0, y: -1 };
    case Direction.DOWN:
      return { x: 0, y: 1 };
  }
}

function turnRight(direction: Direction) {
  switch (direction) {
    case Direction.LEFT:
      return Direction.UP;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.UP:
      return Direction.RIGHT;
  }
}

const isObstructed = (p: Vec2, m: string[][]) => m[p.y]?.[p.x] == "#";
const isInBounds = (p: Vec2, m: string[][]) => Boolean(m[p.y]?.[p.x]);

function getVisitedLocations(initialGuard: Guard, map: string[][]) {
  const visited = new Set<number>();
  const guard = clone(initialGuard);

  while (isInBounds(guard.position, map)) {
    const vector = getDirectionVector(guard.direction);
    const next: Vec2 = {
      x: guard.position.x + vector.x,
      y: guard.position.y + vector.y,
    };

    if (isObstructed(next, map)) {
      guard.direction = turnRight(guard.direction);
    } else {
      visited.add(hash(guard.position.x, guard.position.y));
      guard.position = next;
    }
  }

  return visited;
}

export function part1(input: string) {
  const { map, guard } = parseInput(input);
  return getVisitedLocations(guard, map).size;
}

export function part2(input: string) {
  const { map, guard: initialGuard } = parseInput(input);

  return [...getVisitedLocations(initialGuard, map)].reduce((acc, location) => {
    const steps = new Set<number>();
    const guard: Guard = clone(initialGuard);

    while (isInBounds(guard.position, map)) {
      const step = hash(
        guard.position.x,
        guard.position.y,
        guard.direction,
      );

      if (steps.has(step)) return acc + 1;

      const vector = getDirectionVector(guard.direction);
      const next: Vec2 = {
        x: guard.position.x + vector.x,
        y: guard.position.y + vector.y,
      };

      if (isObstructed(next, map) || hash(next.x, next.y) == location) {
        guard.direction = turnRight(guard.direction);
      } else {
        steps.add(step);
        guard.position = next;
      }
    }

    return acc;
  }, 0);
}

const exampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 41));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 6));
