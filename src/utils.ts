export function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => acc.flatMap((x) => array.map((y) => [...x, y])),
    [[]],
  );
}

export function permute<T>(items: T[]): T[][] {
  const result: T[][] = [];

  if (items.length == 0) return [];
  if (items.length == 1) return [items];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const remaining = permute(
      items.slice(0, i).concat(items.slice(i + 1)),
    );
    for (let j = 0; j < remaining.length; j++) {
      const permutedArray = [item].concat(remaining[j]);
      result.push(permutedArray);
    }
  }

  return result;
}

export function hash(a: number, b = 0, c = 0) {
  return a ^ (b << 10) ^ (c << 20);
}
