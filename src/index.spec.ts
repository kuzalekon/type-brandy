import type { Brand, Brander } from './index';
import { make } from './index';

type DateStr = Brand<string, 'DateStr'>;

describe('brand validator', () => {
  const VALID_DATE = '10/10/2022';
  const INVALID_DATE = '20/10/2022';
  const ERROR_MESSAGE = 'invalid american date';

  let DateStr: Brander<DateStr>;

  beforeAll(() => {
    DateStr = make<DateStr>((value: string) => {
      const re = /\b(0?[1-9]|1[012])([\/\-])(0?[1-9]|[12]\d|3[01])\2(\d{4})/g;

      if (!re.test(value)) {
        throw new TypeError(ERROR_MESSAGE);
      }
    });
  });

  it('should return valid date string', () => {
    expect(DateStr(VALID_DATE)).toBe<string>(VALID_DATE);
  });

  it('should throw error on invalid date', () => {
    expect(() => DateStr(INVALID_DATE)).toThrow(TypeError);
  });
});
