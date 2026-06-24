export function sumNumbers(values: (number | null | undefined)[]) {
  return values.reduce<number>(
    (total, value) => total + (typeof value === 'number' ? value : 0),
    0,
  );
}

export function calculateRate(part: number | null | undefined, total: number | null | undefined) {
  if (part === null || part === undefined || !total) {
    return null;
  }

  return part / total;
}

export function calculatePer90(
  value: number | null | undefined,
  minutes: number | null | undefined,
) {
  if (value === null || value === undefined || !minutes) {
    return null;
  }

  return (value / minutes) * 90;
}
