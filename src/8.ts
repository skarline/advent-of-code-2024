import { assertEquals } from "@std/assert";
import { cartesian } from "./utils.ts";

type Antenna = {
  frequency: string;
  x: number;
  y: number;
};

function parseMap(input: string) {
  const map = input
    .split("\n")
    .filter((s) => s.length)
    .map((s) => s.split(""));

  const antennas = map
    .flatMap((row, y) =>
      row.reduce<Antenna[]>((antenas, frequency, x) => {
        if (frequency.match(/[a-zA-Z0-9]/)) {
          return antenas.concat({ frequency, x, y });
        }
        return antenas;
      }, [])
    );

  const width = map[0].length;
  const height = map.length;

  return { antennas, width, height };
}

export function part1(input: string) {
  const { antennas, width, height } = parseMap(input);
  const antinodeIndices = new Set<number>();

  for (const [a, b] of cartesian(antennas, antennas)) {
    if (a != b && a.frequency == b.frequency) {
      const x = 2 * b.x - a.x;
      const y = 2 * b.y - a.y;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        antinodeIndices.add(y * width + x);
      }
    }
  }

  return antinodeIndices.size;
}

export function part2(input: string) {
  const { antennas, width, height } = parseMap(input);
  const antinodeIndices = new Set<number>();

  for (const [a, b] of cartesian(antennas, antennas)) {
    if (a.frequency == b.frequency) {
      if (a == b) {
        antinodeIndices.add(a.y * width + a.x);
      } else {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let x = b.x + dx;
        let y = b.y + dy;
        while (x >= 0 && x < width && y >= 0 && y < height) {
          antinodeIndices.add(y * width + x);
          x += dx;
          y += dy;
        }
      }
    }
  }

  return antinodeIndices.size;
}

const exampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 14));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 34));
