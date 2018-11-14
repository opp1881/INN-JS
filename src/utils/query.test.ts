import { getQueryParamValue } from './query';

describe('query-utils', () => {
  describe('getQueryParamValue', () => {
    it('should return null for missing param key', () => {
      expect(getQueryParamValue('?a=b&c=d', 'e')).toBeNull();
    });

    it('should return return null if only query param value is equal to key', () => {
      expect(getQueryParamValue('?a=b&c=d', 'd')).toBeNull();
    });

    it('should return the value of the query param if present', () => {
      expect(getQueryParamValue('?a=b&c=d', 'c')).toBe('d');
    });

    it('should be case insensitive when finding query params', () => {
      expect(getQueryParamValue('?A=b&C=d', 'c')).toBe('d');
    });
  });
});
