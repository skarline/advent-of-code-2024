import { assertEquals } from "@std/assert";

export function part1(input: string) {
  const stones = input.split(" ").map(Number);
  return countStones(stones, 25);
}

export function part2(input: string) {
  const stones = input.split(" ").map(Number);
  return countStones(stones, 75);
}

const cache = new Map<string, number>();

function countStones(stones: number[], blinks: number): number {
  if (blinks == 0) return stones.length;

  return stones.reduce((acc, stone) => {
    const key = `${stone}-${blinks}`;
    const cached = cache.get(key);
    if (cached) return acc + cached;

    const count = countStones(blink(stone), blinks - 1);
    cache.set(key, count);
    return acc + count;
  }, 0);
}

function blink(stone: number) {
  if (stone === 0) return [1];

  const string = String(stone);
  if (string.length % 2 == 0) {
    return [
      Number(string.slice(0, string.length / 2)),
      Number(string.slice(string.length / 2)),
    ];
  }

  return [stone * 2024];
}

const exampleInput = "125 17";

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 55312));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 65601038650482));
