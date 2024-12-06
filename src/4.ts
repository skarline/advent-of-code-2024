import { assertEquals } from "@std/assert";
import { range, sum } from "https://cdn.skypack.dev/lodash-es";
import { cartesian } from "./utils.ts";

function parseMatrix(input: string) {
  const elements = input.split("\n")
    .map((line) => line.split(""))
    .filter((row) => row.length);

  const width = elements[0].length;
  const height = elements.length;

  return { width, height, elements };
}

export function part1(input: string) {
  const { width, height, elements } = parseMatrix(input);
  const chars = "XMAS".split("");

  const horizontal = [[-1, 0], [1, 0]];
  const vertical = [[0, -1], [0, 1]];
  const diagonal = [[-1, -1], [1, 1], [-1, 1], [1, -1]];

  const directions = [horizontal, vertical, diagonal].flat();

  return sum(
    cartesian(range(width), range(height))
      .map(([x, y]) =>
        directions.filter(([dx, dy]) =>
          chars.every((c, i) => elements[y + dy * i]?.[x + dx * i] == c)
        ).length
      ),
  );
}

export function part2(input: string) {
  const { width, height, elements } = parseMatrix(input);
  const matches = ["MAS", "SAM"];

  return cartesian(range(width - 3), range(height - 3)).filter(([x, y]) => {
    const a = range(0, 3).map((i) => elements[y + i][x + i]);
    const b = range(0, 3).map((i) => elements[y + 2 - i][x + i]);

    return (
      matches.includes(a.join("")) &&
      matches.includes(b.join(""))
    );
  }).length;
}

Deno.test("Part 1", () =>
  assertEquals(
    part1(`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`),
    18,
  ));

Deno.test("Part 2", () =>
  assertEquals(
    part2(`
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
`),
    9,
  ));
