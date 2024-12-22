import { assertEquals } from "@std/assert";

function parse(input: string) {
  const sections = input.trim().split("\n\n");

  const patterns = sections[0].split(", ");
  const designs = sections[1].split("\n");

  return { patterns, designs };
}

function isDesignPossible(
  design: string,
  patterns: string[],
  cache = new Map<string, boolean>(),
): boolean {
  if (cache.has(design)) return cache.get(design)!;

  if (design.length == 0) {
    cache.set(design, true);
    return true;
  }

  for (const pattern of patterns) {
    if (design == pattern) {
      cache.set(design, true);
      return true;
    }

    if (design.startsWith(pattern)) {
      const reminder = design.slice(pattern.length);
      if (isDesignPossible(reminder, patterns, cache)) {
        cache.set(design, true);
        return true;
      }
    }
  }

  cache.set(design, false);
  return false;
}

function countPossibleDesigns(
  design: string,
  patterns: string[],
  cache: Map<string, number>,
): number {
  if (cache.has(design)) return cache.get(design)!;

  if (design.length == 0) {
    cache.set(design, 0);
    return 0;
  }

  let count = 0;

  for (const pattern of patterns) {
    if (design == pattern) {
      count++;
    }

    if (design.startsWith(pattern)) {
      const reminder = design.slice(pattern.length);
      count += countPossibleDesigns(reminder, patterns, cache);
    }
  }

  cache.set(design, count);
  return count;
}

export function part1(input: string) {
  const { patterns, designs } = parse(input);
  const patternCache = new Map<string, boolean>();
  return designs.filter((design) =>
    isDesignPossible(design, patterns, patternCache)
  ).length;
}

export function part2(input: string) {
  const { patterns, designs } = parse(input);
  const cache = new Map<string, number>();
  return designs.reduce(
    (acc, design) => acc + countPossibleDesigns(design, patterns, cache),
    0,
  );
}

const exampleInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 6));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 16));
