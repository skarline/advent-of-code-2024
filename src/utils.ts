export function cartesian<T, U>(a: T[], b: U[]) {
  return a.flatMap((x) => b.map((y) => [x, y]) as [T, U][]);
}

export function hash(a: number, b = 0, c = 0) {
  return a ^ (b << 10) ^ (c << 20);
}
