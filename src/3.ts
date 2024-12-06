import { assertEquals } from "@std/assert";

function parseInstructions(program: string) {
  return (program.match(/(mul|do|don't)\((\d+,\d+)*\)/g) || [])
    .reduce<{ code: string; args: number[] }[]>((acc, curr) => {
      const [code, rargs] = curr.split("(");
      const args = rargs.split(",").filter((s) => s.length).map((s) =>
        parseInt(s, 10)
      );
      return acc.concat({ code, args });
    }, []);
}

export function part1(input: string) {
  return parseInstructions(input)
    .filter(({ code }) => code == "mul")
    .reduce((acc, { args: [x, y] }) => acc + x * y, 0);
}

export function part2(input: string) {
  let isMulEnabled = true;
  let sum = 0;

  for (const { code, args: [x, y] } of parseInstructions(input)) {
    if (code == "do") isMulEnabled = true;
    if (code == "don't") isMulEnabled = false;
    if (code == "mul" && isMulEnabled) sum += x * y;
  }

  return sum;
}

Deno.test("Part 1", () =>
  assertEquals(
    part1(
      "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))",
    ),
    161,
  ));

Deno.test("Part 2", () =>
  assertEquals(
    part2(
      "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))",
    ),
    48,
  ));
