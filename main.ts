async function runChallenge(day: number) {
  try {
    const { part1, part2 } = await import(`./src/${day}.ts`);
    const input = await Deno.readTextFile(`./src/${day}.txt`);

    console.log(`[Day ${day}]`);

    const run = (part: number) => {
      performance.mark("start");
      const answer = part === 1 ? part1(input) : part2(input);
      performance.mark("end");
      const { duration } = performance.measure("start", "end");
      console.log(`Part ${part}: ${answer} (${duration.toFixed(2)}ms)`);
    };

    if (part1) run(1);
    if (part2) run(2);
  } catch {
    return new Error(`Day ${day} not yet implemented`);
  }
}

const selectedDay = Deno.args[0];

if (selectedDay) {
  runChallenge(Number(selectedDay));
} else {
  for (let i = 1; i <= 25; i++) {
    try {
      runChallenge(i);
    } catch {
      // Not yet implemented
      break;
    }
  }
}
