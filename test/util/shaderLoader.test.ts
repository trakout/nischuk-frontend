import { expect, test } from 'vitest';
import * as shaderLoader from '../../src/util/shaderLoader';

test('loadShader is exported as a function', () => {
  expect(typeof shaderLoader.loadShader).toBe('function');
});