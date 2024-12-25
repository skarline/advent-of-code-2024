import { assertEquals } from "@std/assert";
import { range, sum } from "https://cdn.skypack.dev/lodash-es";

function parse(input: string) {
  return input.trim().split("\n").map(BigInt);
}

function randomize(n: bigint) {
  n = ((n * 64n) ^ n) % 16777216n;
  n = ((n / 32n) ^ n) % 16777216n;
  n = ((n * 2048n) ^ n) % 16777216n;
  return n;
}

function getPriceSequence(secret: bigint, length: number) {
  return range(length)
    .reduce<bigint[]>((acc) => acc.concat(randomize(acc.at(-1)!)), [secret])
    .map((n) => n % 10n)
    .map<[number, number | null]>((
      p,
      i,
      prices,
    ) => [Number(p), i > 0 ? Number(p - prices[i - 1]) : null]);
}

export function part1(input: string) {
  return sum(
    parse(input).map((p) => range(2000).reduce((acc) => randomize(acc), p)),
  );
}

export function part2(input: string) {
  const secrets = parse(input);
  const priceSequences = secrets.map((secret) =>
    getPriceSequence(secret, 2001)
  );

  const changeSequenceMap: Record<string, number> = {};

  priceSequences.map((priceSequence) => {
    const seen = new Map<string, boolean>();

    for (let i = 4; i < priceSequence.length; i++) {
      const changeSequence = range(-3, 1).map((j) => priceSequence[i + j][1]);
      const key = changeSequence.join(",");

      if (!seen.has(key)) {
        changeSequenceMap[key] ??= 0;
        changeSequenceMap[key] += priceSequence[i][0];
        seen.set(key, true);
      }
    }
  });

  return Math.max(...Object.values(changeSequenceMap));
}

Deno.test("Part 1", () =>
  assertEquals(
    part1(`
1
10
100
2024`),
    37327623n,
  ));
Deno.test("Part 2", () =>
  assertEquals(
    part2(`
1
2
3
2024`),
    23,
  ));
