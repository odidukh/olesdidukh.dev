type DateFormat = 'short' | 'long';

const FORMAT_OPTIONS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { month: 'long', day: 'numeric', year: 'numeric' },
};

export function formatDate(
  date: string | Date,
  format: DateFormat = 'short'
): string {
  return new Date(date).toLocaleDateString('en-US', FORMAT_OPTIONS[format]);
}
