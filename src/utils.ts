export function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => acc.flatMap((x) => array.map((y) => [...x, y])),
    [[]],
  );
}

export function hash(a: number, b = 0, c = 0) {
  return a ^ (b << 10) ^ (c << 20);
}
