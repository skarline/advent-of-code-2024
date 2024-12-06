for (let i = 1; i <= 25; i++) {
  try {
    const { part1, part2 } = await import(`./src/${i}.ts`);
    const input = await Deno.readTextFile(`./src/${i}.txt`);

    console.log(`[Day ${i}]`);

    if (part1) {
      performance.mark("A");
      const answer = part1(input);
      const { duration } = performance.measure("A", "A");
      console.log("Part 1:", answer, `(${duration.toFixed(2)}ms)`);
    }
    if (part2) {
      performance.mark("B");
      const answer = part2(input);
      const { duration } = performance.measure("B", "B");
      console.log("Part 2:", answer, `(${duration.toFixed(2)}ms)`);
    }
  } catch {
    // Not yet implemented
    break;
  }
}
