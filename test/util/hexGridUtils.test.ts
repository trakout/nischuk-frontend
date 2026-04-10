import { expect, test, describe } from 'vitest';
import { getHexPosition } from '../../src/util/hexGridUtils';

describe('getHexPosition', () => {
  test('hex pos', () => {
    expect(getHexPosition(1, 2)).toEqual({ x: 1, y: 2 });
  });

  test('returns correct coordinates for positive numbers', () => {
    expect(getHexPosition(5, 10)).toEqual({ x: 5, y: 10 });
  });

  test('returns correct coordinates for negative numbers', () => {
    expect(getHexPosition(-3, -7)).toEqual({ x: -3, y: -7 });
  });

  test('returns correct coordinates for zero', () => {
    expect(getHexPosition(0, 0)).toEqual({ x: 0, y: 0 });
  });

  test('returns correct coordinates for decimal numbers', () => {
    expect(getHexPosition(1.5, 2.5)).toEqual({ x: 1.5, y: 2.5 });
  });

  test('returns correct coordinates for mixed signs', () => {
    expect(getHexPosition(-5, 10)).toEqual({ x: -5, y: 10 });
  });
});