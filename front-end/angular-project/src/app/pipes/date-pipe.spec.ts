import { DateBrPipe } from './date-pipe';

describe('DateBrPipe', () => {
  let pipe: DateBrPipe;

  beforeEach(() => {
    pipe = new DateBrPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform date in YYYY-MM-DD format to DD/MM format', () => {
    const result = pipe.transform('2025-01-15');
    expect(result).toBe('15/01');
  });

  it('should transform another date correctly', () => {
    const result = pipe.transform('2025-12-25');
    expect(result).toBe('25/12');
  });

  it('should return empty string for null or undefined input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should return original value for invalid date format', () => {
    expect(pipe.transform('invalid-date')).toBe('invalid-date');
    expect(pipe.transform('2025')).toBe('2025');
    expect(pipe.transform('25/12/2025')).toBe('25/12/2025');
  });

  it('should handle edge cases', () => {
    expect(pipe.transform('2025-01-01')).toBe('01/01');
    expect(pipe.transform('2025-12-31')).toBe('31/12');
  });
});
