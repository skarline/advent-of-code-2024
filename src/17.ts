import { assertEquals } from "@std/assert";

type Computer = {
  program: bigint[];
  ip: number;
  a: bigint;
  b: bigint;
  c: bigint;
};

function parse(input: string): Computer {
  const sections = input.trim().split("\n\n");

  const [a, b, c] = sections[0].split("\n").map((s) =>
    BigInt(s.split(": ")[1])
  );
  const program = sections[1].split(": ")[1].split(",").map(BigInt);

  return { program, ip: 0, a, b, c };
}

function emulate(computer: Computer) {
  const buffer: bigint[] = [];

  while (computer.ip < computer.program.length) {
    const opcode = computer.program[computer.ip++];
    const literal = computer.program[computer.ip++];

    let combo = literal;
    if (literal == 4n) combo = computer.a;
    if (literal == 5n) combo = computer.b;
    if (literal == 6n) combo = computer.c;
    if (literal == 7n) throw new Error("Invalid operand");

    switch (opcode) {
      case 0n: // adv
        computer.a = computer.a / 2n ** combo;
        break;
      case 1n: // bxl
        computer.b = computer.b ^ literal;
        break;
      case 2n: // bst
        computer.b = combo % 8n;
        break;
      case 3n: // jnz
        if (computer.a != 0n) computer.ip = Number(literal);
        break;
      case 4n: // bxc
        computer.b = computer.b ^ computer.c;
        break;
      case 5n: // out
        buffer.push(combo % 8n);
        break;
      case 6n: // bdv
        computer.b = computer.a / 2n ** combo;
        break;
      case 7n: // cdv
        computer.c = computer.a / 2n ** combo;
        break;
    }
  }

  return buffer;
}

export function part1(input: string) {
  const computer = parse(input);
  return emulate(computer).join(",");
}

export function part2(input: string) {
  const computer = parse(input);
  let a = 0n;
  let matchedDigits = 0;

  while (true) {
    for (let i = 0n; true; i++) {
      const test = a * 8n + i;
      computer.a = test;
      computer.b = 0n;
      computer.c = 0n;
      computer.ip = 0;

      const output = emulate(computer);

      const matchingDigits = countMatchingElementsRight(
        output,
        computer.program,
      );

      if (matchingDigits == computer.program.length) {
        return test;
      }

      if (matchingDigits > matchedDigits) {
        matchedDigits = matchingDigits;
        a = test;
        break;
      }
    }
  }
}

function countMatchingElementsRight<T>(a: T[], b: T[]) {
  let count = 0;
  const min = Math.min(a.length, b.length);

  for (let i = 1; i <= min; i++) {
    if (a[a.length - i] === b[b.length - i]) count++;
    else break;
  }

  return count;
}

Deno.test("Part 1", () =>
  assertEquals(
    part1(`
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`),
    "4,6,3,5,6,3,5,2,1,0",
  ));
Deno.test("Part 2", () =>
  assertEquals(
    part2(`
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`),
    117440n,
  ));
