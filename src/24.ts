import { assertEquals } from "@std/assert";

type Operation = {
  input1: string;
  input2: string;
  output: string;
  gate: string;
};

function parse(input: string) {
  const sections = input.trim().split("\n\n");

  const wires = sections[0]
    .split("\n")
    .map((line) => line.split(": "))
    .reduce<Record<string, boolean>>(
      (acc, [key, value]) => ({ ...acc, [key]: Boolean(+value) }),
      {},
    );

  const operations = sections[1]
    .split("\n")
    .map<Operation>((line) => {
      const [left, output] = line.split("->").map((s) => s.trim());
      const [input1, gate, input2] = left.split(" ");
      return { input1, input2, output, gate };
    });

  return { wires, operations };
}

function simulateCircuit(
  wires: Record<string, boolean>,
  operations: Operation[],
) {
  const state = { ...wires };
  const queue = [...operations];

  while (queue.length) {
    const operation = queue.shift()!;
    const { input1, input2, output, gate } = operation;

    if (input1 in state && input2 in state) {
      if (gate == "AND") state[output] = state[input1] && state[input2];
      if (gate == "OR") state[output] = state[input1] || state[input2];
      if (gate == "XOR") state[output] = state[input1] !== state[input2];
    } else {
      queue.push(operation);
    }
  }

  return state;
}

export function findWrongWires(operations: Operation[]) {
  const highestZ = operations
    .map((op) => op.output).filter((key) => key.startsWith("z")).sort().at(-1);

  const adjacency: Record<string, string[]> = {};
  for (const { input1, input2, gate } of operations) {
    (adjacency[input1] ??= []).push(gate);
    (adjacency[input2] ??= []).push(gate);
  }

  function validate(op: Operation): boolean {
    const { input1, input2, output, gate } = op;

    const half = input1.endsWith("00") || input2.endsWith("00");
    const inputXY = Boolean(input1.match(/[xy]/) && input2.match(/[xy]/));
    const outputZ = output.startsWith("z");
    const outputMSB = output === highestZ;
    const xor = gate === "XOR";
    const and = gate === "AND";
    const nextXor = adjacency[output]?.includes("XOR");
    const nextOr = adjacency[output]?.includes("OR");

    if (outputZ && !outputMSB && !xor) return false;
    if (!outputZ && !inputXY && xor) return false;
    if (!half && xor && inputXY && !nextXor) return false;
    if (!half && and && !nextOr) return false;

    return true;
  }

  return operations.filter((op) => !validate(op)).map((op) => op.output);
}

export function part1(input: string) {
  const { wires, operations } = parse(input);
  const state = simulateCircuit(wires, operations);
  const outputBits = Object.keys(state)
    .filter((k) => k.startsWith("z")).sort().map((k) => state[k]);
  return outputBits
    .reduce((acc, bit, i) => acc + +bit * (2 ** i), 0);
}

export function part2(input: string) {
  const { operations } = parse(input);
  return findWrongWires(operations).sort().join(",");
}

Deno.test("Part 1 (short)", () =>
  assertEquals(
    part1(`
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`),
    4,
  ));
Deno.test("Part 1", () =>
  assertEquals(
    part1(`
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`),
    2024,
  ));
