import { assertEquals } from "@std/assert";
import { range } from "https://cdn.skypack.dev/lodash-es";

function parseReports(input: string) {
  return input
    .split("\n")
    .filter(Boolean)
    .map((report) => report.split(" ").map(Number));
}

export function part1(input: string) {
  return parseReports(input)
    .filter(isReportSafe)
    .length;
}

export function part2(input: string) {
  return parseReports(input)
    .filter((report) =>
      range(-1, report.length)
        .some((i) => isReportSafe(report.filter((_, j) => j !== i)))
    ).length;
}

function isReportSafe(report: number[]) {
  const pairs = report.slice(0, -1).map((a, i) => [a, report[i + 1]]);
  const sign = Math.sign(report.at(-1)! - report.at(0)!);

  if (pairs.some(([a, b]) => Math.sign(b - a) != sign)) return false;
  if (pairs.some(([a, b]) => Math.abs(b - a) > 3)) return false;

  return true;
}

const exampleInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 2));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 4));
