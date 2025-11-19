export function solve(a: number, b: number, c: number): Array<number> {
  const d = b ** 2 - 4 * a * c;
  if (d > 0) {
    return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
  } else if (d == 0) {
    return [-b / (2 * a)];
  } else {
    return [];
  }
}