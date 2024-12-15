import { assertEquals } from "@std/assert";

function parse(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [left, right] = line.split(" ");

      const [px, py] = left.split("=")[1].split(",").map(Number);
      const [vx, vy] = right.split("=")[1].split(",").map(Number);

      return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
    });
}

export function part1(input: string, w = 101, h = 103) {
  const robots = parse(input);

  for (let i = 0; i < 100; i++) {
    for (const { position, velocity } of robots) {
      position.x = (((position.x + velocity.x) % w) + w) % w;
      position.y = (((position.y + velocity.y) % h) + h) % h;
    }
  }

  const middleX = Math.floor(w / 2);
  const middleY = Math.floor(h / 2);

  const [q1, q2, q3, q4] = robots.reduce((acc, { position }) => {
    if (position.x < middleX && position.y < middleY) acc[0]++;
    if (position.x < middleX && position.y > middleY) acc[1]++;
    if (position.x > middleX && position.y < middleY) acc[2]++;
    if (position.x > middleX && position.y > middleY) acc[3]++;
    return acc;
  }, [0, 0, 0, 0]);

  return q1 * q2 * q3 * q4;
}

const exampleInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput, 11, 7), 12));
