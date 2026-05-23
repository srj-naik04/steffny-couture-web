'use client';

/**
 * LastBookingSummary — Phase 6
 *
 * Client component. Reads the last booking summary from sessionStorage
 * (`steffny-last-booking`), displays it once, then clears the entry.
 *
 * If sessionStorage is unavailable or the entry is missing (e.g. user
 * navigated directly to this URL), renders a graceful fallback.
 */

import * as React from 'react';

interface LastBooking {
  reference: string;
  type: 'alteration' | 'custom' | 'consultation';
  garmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  guestName: string;
  guestEmail: string;
}

const SERVICE_LABELS: Record<string, string> = {
  alteration: 'Alterations',
  custom: 'Custom piece',
  consultation: 'Consultation',
};

function formatDate(iso: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? 'pm' : 'am';
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 py-2.5 border-b border-border last:border-0">
      <dt className="text-small text-ink-muted">{label}</dt>
      <dd className="text-small font-medium text-ink">{value}</dd>
    </div>
  );
}

export function LastBookingSummary() {
  const [booking, setBooking] = React.useState<LastBooking | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem('steffny-last-booking');
      if (raw) {
        const parsed = JSON.parse(raw) as LastBooking;
        setBooking(parsed);
        sessionStorage.removeItem('steffny-last-booking');
      }
    } catch {
      // sessionStorage unavailable or parse failed — non-fatal
    }
    setLoaded(true);
  }, []);

  if (!loaded || !booking) {
    // Don't render a skeleton — just nothing; it's supplementary info
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-label uppercase tracking-widest text-ink-subtle">
          Your booking summary
        </h2>
      </div>
      <dl className="px-5 py-1">
        <SummaryRow label="Service" value={SERVICE_LABELS[booking.type] ?? booking.type} />
        <SummaryRow label="Garment" value={booking.garmentType} />
        <SummaryRow
          label="Preferred date"
          value={formatDate(booking.appointmentDate)}
        />
        <SummaryRow
          label="Preferred time"
          value={formatTime(booking.appointmentTime)}
        />
        <SummaryRow label="Name" value={booking.guestName} />
        <SummaryRow label="Email" value={booking.guestEmail} />
      </dl>
    </div>
  );
}
