import { assertEquals } from "@std/assert";
import { range } from "https://cdn.skypack.dev/lodash-es";

function parse(input: string) {
  const bytes = input.trim().split("\n")
    .map((line) => line.split(",").map(Number));

  return { bytes };
}

function createCostMatrix(corruptionMatrix: boolean[][]) {
  const size = corruptionMatrix.length;
  const costMatrix = range(size).map(() => range(size).map(() => Infinity));

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const queue: { x: number; y: number; cost: number }[] = [
    { x: 0, y: 0, cost: 0 },
  ];

  costMatrix[0][0] = 0;

  while (queue.length) {
    const { x, y, cost } = queue.shift()!;

    costMatrix[y][x] = cost;
    const newCost = cost + 1;

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= size) continue;
      if (ny < 0 || ny >= size) continue;
      if (corruptionMatrix[ny][nx]) continue;

      if (newCost < costMatrix[ny][nx]) {
        costMatrix[ny][nx] = newCost;
        queue.push({ x: nx, y: ny, cost: newCost });
      }
    }
  }

  return costMatrix;
}

export function part1(input: string, size = 71, afterBytes = 1024) {
  const { bytes } = parse(input);

  const corruptionMatrix = range(size).map(() => range(size).map(() => false));

  for (const [x, y] of bytes.slice(0, afterBytes)) {
    corruptionMatrix[y][x] = true;
  }

  const costMatrix = createCostMatrix(corruptionMatrix);
  return costMatrix[size - 1][size - 1];
}

export function part2(input: string, size = 71) {
  const { bytes } = parse(input);

  const corruptionMatrix = range(size).map(() => range(size).map(() => false));

  while (bytes.length) {
    const [x, y] = bytes.shift()!;
    corruptionMatrix[y][x] = true;

    const costMatrix = createCostMatrix(corruptionMatrix);
    const exitCost = costMatrix[size - 1][size - 1];

    if (exitCost == Infinity) {
      return [x, y].join(",");
    }
  }
}

const exampleInput = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput, 7, 12), 22));
Deno.test("Part 2", () => assertEquals(part2(exampleInput, 7), "6,1"));
