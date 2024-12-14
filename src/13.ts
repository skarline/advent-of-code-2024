import { assertEquals } from "@std/assert";

type Point = {
  x: number;
  y: number;
};

type Machine = {
  a: Point;
  b: Point;
  prize: Point;
};

function parse(input: string): Machine[] {
  return input.trim().split("\n\n")
    .map((machine) => {
      const lines = machine.split("\n");
      const [ax, ay] = lines[0]
        .split(": ")[1].split(", ")
        .map((s) => Number(s.split("+")[1]));
      const [bx, by] = lines[1]
        .split(": ")[1].split(", ")
        .map((s) => Number(s.split("+")[1]));
      const [prizeX, prizeY] = lines[2]
        .split(": ")[1].split(", ")
        .map((s) => Number(s.split("=")[1]));

      return {
        a: { x: ax, y: ay },
        b: { x: bx, y: by },
        prize: { x: prizeX, y: prizeY },
      };
    });
}

export function part1(input: string) {
  return parse(input).reduce((acc, machine) => {
    const tokens = getMinRequiredTokensFor(machine);
    return tokens ? acc + tokens : acc;
  }, 0);
}

export function part2(input: string) {
  return parse(input).reduce((acc, machine) => {
    machine.prize.x += 10000000000000;
    machine.prize.y += 10000000000000;
    const tokens = getMinRequiredTokensFor(machine);
    return tokens ? acc + tokens : acc;
  }, 0);
}

function getMinRequiredTokensFor({ a, b, prize }: Machine) {
  const det = a.x * b.y - a.y * b.x;
  if (det == 0) return null;

  const numA = prize.x * b.y - prize.y * b.x;
  const numB = prize.y * a.x - prize.x * a.y;

  if (numA % det != 0 || numB % det != 0) {
    return null;
  }

  return 3 * (numA / det) + (numB / det);
}

const exampleInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 480));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), 875318608908));
