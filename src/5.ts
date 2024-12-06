import { assertEquals } from "@std/assert";
import { isEqual } from "https://cdn.skypack.dev/lodash-es";

function parseInput(input: string) {
  const sections = input
    .split("\n\n")
    .map((s) => s.split("\n").filter((s) => s.length));

  const rules = sections[0].map((s) => s.split("|").map(Number));
  const updates = sections[1].map((s) => s.split(",").map(Number));

  return { rules, updates };
}

export function part1(input: string) {
  const { rules, updates } = parseInput(input);

  return updates.reduce((acc, update) =>
    isEqual(
        update,
        update.toSorted((a, b) => {
          for (const [x, y] of rules) {
            if (a == x && b == y) return -1;
            if (a == y && b == x) return 1;
          }
          return 0;
        }),
      )
      ? acc + update[Math.floor(update.length / 2)]
      : acc, 0);
}

export function part2(input: string) {
  const { rules, updates } = parseInput(input);

  return updates.reduce((acc, update) => {
    const sorted = update.toSorted((a, b) => {
      for (const [x, y] of rules) {
        if (a == x && b == y) return -1;
        if (a == y && b == x) return 1;
      }
      return 0;
    });

    return isEqual(update, sorted)
      ? acc
      : acc + sorted[Math.floor(sorted.length / 2)];
  }, 0);
}

Deno.test("Part 1", () =>
  assertEquals(
    part1(`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`),
    143,
  ));

Deno.test("Part 2", () =>
  assertEquals(
    part2(`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`),
    123,
  ));
