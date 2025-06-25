const parseDateFilter = require('../../../helpers/parseDateFilter');

describe('parseDateFilter', () => {
  it('should parse full date dd/mm/yyyy', () => {
    expect(parseDateFilter('25/12/2023')).toBe('2023-12-25');
  });

  it('should parse partial date dd/mm', () => {
    expect(parseDateFilter('05/07')).toBe('07-05');
  });

  it('should parse month/year mm/yyyy', () => {
    expect(parseDateFilter('11/2022')).toBe('2022-11');
  });

  it('should return null for invalid format', () => {
    expect(parseDateFilter('2022-11-05')).toBeNull();
    expect(parseDateFilter('13/2022')).toBeNull();
    expect(parseDateFilter('')).toBeNull();
    expect(parseDateFilter('abc')).toBeNull();
  });
});