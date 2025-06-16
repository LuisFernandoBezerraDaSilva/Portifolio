function parseDateFilter(input) {

  const fullDateMatch = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (fullDateMatch) {
    const [, dd, mm, yyyy] = fullDateMatch;
    if (parseInt(mm) < 1 || parseInt(mm) > 12 || parseInt(dd) < 1 || parseInt(dd) > 31) return null;
    return `${yyyy}-${mm}-${dd}`;
  }

  const partialDateMatch = input.match(/^(\d{2})\/(\d{2})$/);
  if (partialDateMatch) {
    const [, dd, mm] = partialDateMatch;
    if (parseInt(mm) < 1 || parseInt(mm) > 12 || parseInt(dd) < 1 || parseInt(dd) > 31) return null;
    return `${mm}-${dd}`;
  }

  const monthYearMatch = input.match(/^(\d{2})\/(\d{4})$/);
  if (monthYearMatch) {
    const [, mm, yyyy] = monthYearMatch;
    if (parseInt(mm) < 1 || parseInt(mm) > 12) return null;
    return `${yyyy}-${mm}`;
  }
  return null;
}

module.exports = parseDateFilter;