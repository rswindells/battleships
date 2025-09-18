import { describe, it, expect } from 'vitest';
import { getAlphabetSubset, getNumberSubset, isValidCoordinate } from './main';

describe('getAlphabetSubset', () => {
  it('returns correct subset for valid input', () => {
    expect(getAlphabetSubset(1)).toEqual(['A']);
    expect(getAlphabetSubset(3)).toEqual(['A', 'B', 'C']);
    expect(getAlphabetSubset(5)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(getAlphabetSubset(26)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ]);
  });

  it('throws error for invalid input - too small', () => {
    expect(() => getAlphabetSubset(0)).toThrow('n must be between 1 and 26');
    expect(() => getAlphabetSubset(-1)).toThrow('n must be between 1 and 26');
  });

  it('throws error for invalid input - too large', () => {
    expect(() => getAlphabetSubset(27)).toThrow('n must be between 1 and 26');
    expect(() => getAlphabetSubset(30)).toThrow('n must be between 1 and 26');
  });
});

describe('getNumberSubset', () => {
  it('returns correct subset for valid input', () => {
    expect(getNumberSubset(1)).toEqual([1]);
    expect(getNumberSubset(3)).toEqual([1, 2, 3]);
    expect(getNumberSubset(5)).toEqual([1, 2, 3, 4, 5]);
    expect(getNumberSubset(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('works with large numbers', () => {
    const result = getNumberSubset(100);
    expect(result).toHaveLength(100);
    expect(result[0]).toBe(1);
    expect(result[99]).toBe(100);
  });

  it('throws error for invalid input', () => {
    expect(() => getNumberSubset(0)).toThrow('n must be at least 1');
    expect(() => getNumberSubset(-1)).toThrow('n must be at least 1');
    expect(() => getNumberSubset(-5)).toThrow('n must be at least 1');
  });
});

describe('isValidCoordinate', () => {
  it('returns true for valid coordinates', () => {
    expect(isValidCoordinate('A1')).toBe(true);
    expect(isValidCoordinate('B5')).toBe(true);
    expect(isValidCoordinate('J10')).toBe(true);
    expect(isValidCoordinate('F9')).toBe(true);
    expect(isValidCoordinate('E2')).toBe(true);
  });

  it('handles case insensitive input', () => {
    expect(isValidCoordinate('a1')).toBe(true);
    expect(isValidCoordinate('j10')).toBe(true);
    expect(isValidCoordinate('f9')).toBe(true);
  });

  it('returns false for invalid letters', () => {
    expect(isValidCoordinate('K1')).toBe(false);
    expect(isValidCoordinate('Z5')).toBe(false);
  });

  it('returns false for invalid numbers', () => {
    expect(isValidCoordinate('A0')).toBe(false);
    expect(isValidCoordinate('B11')).toBe(false);
    expect(isValidCoordinate('J12')).toBe(false);
    expect(isValidCoordinate('F99')).toBe(false);
  });

  it('returns false for invalid formats', () => {
    expect(isValidCoordinate('')).toBe(false);
    expect(isValidCoordinate('A')).toBe(false);
    expect(isValidCoordinate('1')).toBe(false);
    expect(isValidCoordinate('1A')).toBe(false);
    expect(isValidCoordinate('AA1')).toBe(false);
    expect(isValidCoordinate('A1B')).toBe(false);
    expect(isValidCoordinate('A 1')).toBe(false);
    expect(isValidCoordinate(' A1')).toBe(false);
    expect(isValidCoordinate('A1 ')).toBe(false);
  });
});
