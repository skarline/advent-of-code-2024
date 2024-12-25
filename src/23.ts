import { assertEquals } from "@std/assert";

function parse(input: string) {
  return input.trim().split("\n")
    .map((line) => line.split("-"));
}

function buildGraph(edges: string[][]) {
  const graph: Record<string, string[]> = {};

  for (const [a, b] of edges) {
    (graph[a] ??= []).push(b);
    (graph[b] ??= []).push(a);
  }

  return graph;
}

function findTriangles(edges: string[][]) {
  const graph = buildGraph(edges);
  const vertices = Object.keys(graph);
  const triangles: string[][] = [];

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      for (let k = j + 1; k < vertices.length; k++) {
        const a = vertices[i];
        const b = vertices[j];
        const c = vertices[k];

        if (
          graph[a].includes(b) &&
          graph[b].includes(c) &&
          graph[c].includes(a)
        ) {
          triangles.push([a, b, c]);
        }
      }
    }
  }

  return triangles;
}

function findMaximumClique(edges: string[][]) {
  const graph = buildGraph(edges);
  const vertices = Object.keys(graph);

  let maxClique: string[] = [];

  function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>) {
    if (!p.size && !x.size) {
      if (r.size > maxClique.length) maxClique = [...r];
      return;
    }

    const [pivot] = p.union(x);

    if (pivot) {
      const neighbors = new Set(graph[pivot]);
      const candidates = [...p].filter((v) => !neighbors.has(v));
      for (const v of candidates) exploreVertex(v);
    } else {
      for (const v of p) exploreVertex(v);
    }

    function exploreVertex(v: string) {
      const newR = new Set(r).add(v);
      const newP = new Set([...p].filter((w) => graph[v].includes(w)));
      const newX = new Set([...x].filter((w) => graph[v].includes(w)));

      bronKerbosch(newR, newP, newX);

      p.delete(v);
      x.add(v);
    }
  }

  bronKerbosch(new Set(), new Set(vertices), new Set());
  return maxClique.sort();
}

export function part1(input: string) {
  const triangles = findTriangles(parse(input));
  return triangles.filter((tri) => tri.some((v) => v.startsWith("t"))).length;
}

export function part2(input: string) {
  return findMaximumClique(parse(input)).join(",");
}

const exampleInput = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

Deno.test("Part 1", () => assertEquals(part1(exampleInput), 7));
Deno.test("Part 2", () => assertEquals(part2(exampleInput), "co,de,ka,ta"));
