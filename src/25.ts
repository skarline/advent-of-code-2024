import { assertEquals } from "@std/assert";
import { cartesian } from "./utils.ts";

function parse(input: string) {
  const schematics = input.trim().split("\n\n");

  const { locks, keys } = schematics.reduce(
    (acc, schema) => {
      const isLock = schema[0] == "#";
      const lines = isLock
        ? schema.split("\n").slice(1)
        : schema.split("\n").slice(0, -1);

      const columns = lines.reduce(
        (counts, line) =>
          counts.map((count, i) => count + (line[i] === "#" ? 1 : 0)),
        [0, 0, 0, 0, 0],
      );

      return acc[isLock ? "locks" : "keys"].push(columns), acc;
    },
    { locks: [] as number[][], keys: [] as number[][] },
  );

  return { locks, keys };
}

export function part1(input: string) {
  const { locks, keys } = parse(input);
  return cartesian(locks, keys).filter(([lock, key]) =>
    lock.every((_, i) => (lock[i] + key[i]) <= 5)
  ).length;
}

const exampleInput = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 3));
