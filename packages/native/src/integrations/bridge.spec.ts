import { describe, expect } from '@jest/globals';
import { bridge } from './bridge';

describe('bridge procedures', () => {
  it('should return a function', () => {
    const result = bridge({
      test: () => {
        return 'test';
      },
    });
    expect(result.test()).toBe('test');
  });
});
