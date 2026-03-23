/**
 * Format a date value to "Month Year" string.
 * e.g. "2022-01-01T00:00:00.000Z" → "January 2022"
 */
export function formatMonthYear(date: string | Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date range for display on experience/timeline components.
 * e.g. "January 2020 – December 2021" or "March 2022 – Present"
 */
export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : 'Present';
  return `${start} – ${end}`;
}

/**
 * Format a date to a full "Month Day, Year" string.
 * e.g. "2022-01-01T00:00:00.000Z" → "January 1, 2022"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date to a short "Mon YYYY" string (abbreviated month).
 * e.g. "2022-01-01T00:00:00.000Z" → "Jan 2022"

 */
export function formatMonthYearShort(date: string | Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}
