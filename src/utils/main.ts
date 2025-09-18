function getAlphabetSubset(n: number): string[] {
  if (n < 1 || n > 26) throw new Error('n must be between 1 and 26');
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}
function getNumberSubset(n: number): number[] {
  if (n < 1) throw new Error('n must be at least 1');
  return Array.from({ length: n }, (_, i) => i + 1);
}

function isValidCoordinate(coord: string): boolean {
  const regex = /^[A-J](10|[1-9])$/;
  return regex.test(coord.toUpperCase());
}

export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== '';
}
export { getAlphabetSubset, getNumberSubset, isValidCoordinate };
