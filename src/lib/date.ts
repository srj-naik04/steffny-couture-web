const LONDON = 'Europe/London';

const shortDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: LONDON,
});

const longDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: LONDON,
});

const time12 = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: LONDON,
});

export function formatShortDate(value: Date | string): string {
  return shortDate.format(typeof value === 'string' ? new Date(value) : value);
}

export function formatLongDate(value: Date | string): string {
  return longDate.format(typeof value === 'string' ? new Date(value) : value);
}

export function formatTime(value: Date | string): string {
  return time12.format(typeof value === 'string' ? new Date(value) : value);
}
