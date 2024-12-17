import { assertEquals } from "@std/assert";
import { cartesian } from "./utils.ts";
import { range, uniq } from "https://cdn.skypack.dev/lodash-es";

type MapObject = {
  kind: "robot" | "wall" | "box";
  x: number;
  y: number;
  size: 1 | 2;
};

enum Direction {
  Left,
  Right,
  Up,
  Down,
}

function parse(input: string) {
  const sections = input.trim().split("\n\n");

  const matrix = sections[0].split("\n").map((row) => row.split(""));
  const width = matrix[0].length;
  const height = matrix.length;

  const objects = cartesian(range(width), range(height)).reduce<MapObject[]>(
    (acc, [x, y]) => {
      const token = matrix[y][x];
      if (token == "@") return acc.concat({ kind: "robot", x, y, size: 1 });
      if (token == "#") return acc.concat({ kind: "wall", x, y, size: 1 });
      if (token == "O") return acc.concat({ kind: "box", x, y, size: 1 });
      return acc;
    },
    [],
  );

  const moves = sections[1].replaceAll(/\n/g, "").split("").map((char) => {
    switch (char) {
      case "<":
        return Direction.Left;
      case ">":
        return Direction.Right;
      case "^":
        return Direction.Up;
      case "v":
        return Direction.Down;
      default:
        throw new Error(`Failed to parse move: ${char}`);
    }
  });

  return { objects, moves };
}

function getDirectionVector(direction: Direction) {
  switch (direction) {
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
    case Direction.Up:
      return [0, -1];
    case Direction.Down:
      return [0, 1];
  }
}

function simulate(objects: MapObject[], moves: Direction[]) {
  function collide(obj: MapObject, direction: Direction) {
    const colliders: (MapObject | undefined)[] = [];

    function getObjectAt(x: number, y: number) {
      return objects.find((obj) => {
        if (obj.size == 2) {
          return (obj.x == x || obj.x + 1 == x) && obj.y == y;
        }
        return obj.x == x && obj.y == y;
      });
    }

    switch (direction) {
      case Direction.Left:
        colliders.push(getObjectAt(obj.x - 1, obj.y));
        break;
      case Direction.Right:
        colliders.push(getObjectAt(obj.x + obj.size, obj.y));
        break;
      case Direction.Up:
        colliders.push(getObjectAt(obj.x, obj.y - 1));
        if (obj.size == 2) colliders.push(getObjectAt(obj.x + 1, obj.y - 1));
        break;
      case Direction.Down:
        colliders.push(getObjectAt(obj.x, obj.y + 1));
        if (obj.size == 2) colliders.push(getObjectAt(obj.x + 1, obj.y + 1));
        break;
    }

    return uniq(colliders).filter(Boolean) as MapObject[];
  }

  function isBoxPushable(box: MapObject, direction: Direction): boolean {
    return collide(box, direction).every((collider) => {
      if (collider.kind == "box") {
        return isBoxPushable(collider, direction);
      } else {
        return collider.kind != "wall";
      }
    });
  }

  function pushBox(box: MapObject, direction: Direction) {
    collide(box, direction)
      .filter((collider) => collider.kind == "box")
      .forEach((collider) => pushBox(collider, direction));

    const [nx, ny] = getDirectionVector(direction);
    box.x += nx;
    box.y += ny;
  }

  const robot = objects.find((obj) => obj.kind == "robot")!;

  for (const move of moves) {
    const [dx, dy] = getDirectionVector(move);
    const nx = robot.x + dx;
    const ny = robot.y + dy;

    const [collider] = collide(robot, move);

    if (collider?.kind == "wall") {
      continue;
    } else if (collider?.kind == "box") {
      if (isBoxPushable(collider, move)) {
        pushBox(collider, move);
      } else {
        continue;
      }
    }

    robot.x = nx;
    robot.y = ny;
  }
}

function expand(objects: MapObject[]) {
  objects.forEach((obj) => {
    if (["wall", "box"].includes(obj.kind)) obj.size = 2;
    obj.x *= 2;
  });
}

function getGpsCoordinate(object: MapObject) {
  return object.y * 100 + object.x;
}

export function part1(input: string) {
  const { objects, moves } = parse(input);
  simulate(objects, moves);

  return objects.filter((obj) => obj.kind == "box").reduce(
    (acc, curr) => acc + getGpsCoordinate(curr),
    0,
  );
}

export function part2(input: string) {
  const { objects, moves } = parse(input);

  expand(objects);
  simulate(objects, moves);

  return objects.filter((obj) => obj.kind == "box").reduce(
    (acc, curr) => acc + getGpsCoordinate(curr),
    0,
  );
}

const exampleInput = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

Deno.test("Part 1 (short)", () =>
  assertEquals(
    part1(`
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`),
    2028,
  ));

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 10092));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 9021));
