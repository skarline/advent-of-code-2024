import { assertEquals } from "@std/assert";
import { chunk, range } from "https://cdn.skypack.dev/lodash-es";

type Block = number | null;

function parseInput(input: string) {
  const blocks = chunk(input, 2).reduce<Block[]>(
    (acc, [files, spaces], i) =>
      acc.concat(
        range(files).map(() => i),
        range(spaces).map(() => null),
      ),
    [],
  );

  return { blocks };
}

function getChecksum(blocks: Block[]) {
  return blocks.reduce<number>(
    (acc, curr, i) => curr == null ? acc : acc + curr * i,
    0,
  );
}

export function part1(input: string) {
  const { blocks } = parseInput(input);

  let left = 0;
  let right = blocks.length - 1;

  while (true) {
    while (left < right && blocks[left] != null) left++;
    while (left < right && blocks[right] == null) right--;
    if (left >= right) break;

    blocks[left] = blocks[right];
    blocks[right] = null;

    left++;
    right--;
  }

  return getChecksum(blocks);
}

export function part2(input: string) {
  const { blocks } = parseInput(input);

  for (let id = blocks.findLast((b) => b != null)!; id > 0; id--) {
    const fileIndex = blocks.findIndex((b) => b == id)!;
    const lastFileIndex = blocks.findLastIndex((b) => b == id)!;
    const length = lastFileIndex - fileIndex + 1;

    destIndexLoop: for (
      let destIndex = 0;
      destIndex < fileIndex;
      destIndex++
    ) {
      // Check if destination area is empty
      for (let i = 0; i < length; i++) {
        if (blocks[destIndex + i] != null) continue destIndexLoop;
      }

      // Move file to destination
      for (let i = 0; i < length; i++) {
        blocks[destIndex + i] = id;
        blocks[fileIndex + i] = null;
      }

      break;
    }
  }

  return getChecksum(blocks);
}

const exampleInput = "2333133121414131402";

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 1928));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 2858));
