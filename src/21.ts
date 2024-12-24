import { assertArrayIncludes, assertEquals } from "@std/assert";
import { min, sum } from "https://cdn.skypack.dev/lodash-es";
import { cartesian, permute } from "./utils.ts";

type Point = {
  x: number;
  y: number;
};

function parse(input: string) {
  return input.trim().split("\n");
}

type MatrixEntry<T> = [Point, T];

function matrixEntries<T>(matrix: T[][]) {
  const entries: MatrixEntry<T>[] = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      entries.push([{ x, y }, matrix[y][x]]);
    }
  }
  return entries;
}

const numPadMatrix = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
];

const dirPadMatrix = [
  [" ", "^", "A"],
  ["<", "v", ">"],
];

const numPadEntries = matrixEntries(numPadMatrix);
const dirPadEntries = matrixEntries(dirPadMatrix);

type KeypadEntry = {
  matrix: string[][];
  entries: MatrixEntry<string>[];
  moves: Map<string, string[]>;
};

const keypads = {
  numeric: {
    matrix: numPadMatrix,
    entries: numPadEntries,
    moves: buildPossibleMoves(numPadMatrix, numPadEntries),
  },
  directional: {
    matrix: dirPadMatrix,
    entries: dirPadEntries,
    moves: buildPossibleMoves(dirPadMatrix, dirPadEntries),
  },
};

function buildPossibleMoves(
  matrix: string[][],
  entries: MatrixEntry<string>[],
) {
  return cartesian(entries, entries).reduce(
    (acc, [[origin, a], [target, b]]) => {
      const key = a + b;
      if (a == b) return acc.set(key, ["A"]);

      const dx = target.x - origin.x;
      const dy = target.y - origin.y;

      const directionals = [
        (dx < 0 ? "<" : ">").repeat(Math.abs(dx)).split(""),
        (dy < 0 ? "^" : "v").repeat(Math.abs(dy)).split(""),
      ].flat();

      const permutations = new Set(
        permute(directionals).filter((perm) => {
          let x = origin.x, y = origin.y;
          return perm.every((d) => {
            if (d == "<") x--;
            if (d == ">") x++;
            if (d == "^") y--;
            if (d == "v") y++;
            return matrix[y][x] != " ";
          });
        }).map((p) => p.join("")),
      );

      return acc.set(key, [...permutations].map((p) => p + "A"));
    },
    new Map<string, string[]>(),
  );
}

function generateSequences(code: string, pad: KeypadEntry) {
  return cartesian(
    ...code.split("").map((c, i) => pad.moves.get((code[i - 1] ?? "A") + c)!),
  ).map((sequence) => sequence.join(""));
}

const cache = new Map<string, number>();

function getShortestSeqLength(
  code: string,
  depth: number,
): number {
  if (depth == 0) return code.length;

  const key = `${code}:${depth}`;
  if (cache.has(key)) return cache.get(key)!;

  const subCodes = code.split("A").slice(0, -1).map((s) => s + "A");
  const subSequences = subCodes.map((code) =>
    generateSequences(code, keypads.directional)
  );

  const totalLength = sum(
    subSequences.map((sequences) =>
      min(sequences.map((seq) => getShortestSeqLength(seq, depth - 1)))
    ),
  );

  cache.set(key, totalLength);
  return totalLength;
}

function solve(codes: string[], depth: number) {
  return codes.reduce((acc, code) =>
    acc +
    parseInt(code, 10) * min(
        generateSequences(code, keypads.numeric).map((sequence) =>
          getShortestSeqLength(sequence, depth)
        ),
      ), 0);
}

export function part1(input: string) {
  return solve(parse(input), 2);
}

export function part2(input: string) {
  return solve(parse(input), 25);
}

const exampleInput = `
029A
980A
179A
456A
379A`;

Deno.test("Example 1", () =>
  assertEquals(generateSequences("029A", keypads.numeric), [
    "<A^A>^^AvvvA",
    "<A^A^>^AvvvA",
    "<A^A^^>AvvvA",
  ]));
Deno.test("Example 2", () =>
  assertArrayIncludes(generateSequences("<A^A>^^AvvvA", keypads.directional), [
    "v<<A>>^A<A>AvA<^AA>A<vAAA>^A",
  ]));
Deno.test("Example 3", () =>
  assertArrayIncludes(
    generateSequences("v<<A>>^A<A>AvA<^AA>A<vAAA>^A", keypads.directional),
    ["<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A"],
  ));
Deno.test("Part 1", () => assertEquals(part1(exampleInput), 126384));
