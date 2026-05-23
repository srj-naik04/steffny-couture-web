/**
 * ServicesPreview — Phase 3
 *
 * Server component. Renders the three service cards for the home page.
 * Data comes from src/content/marketing/home.ts servicesPreview export.
 */

import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import type { ServicesPreview as ServicesPreviewData } from '@/content/marketing/home';

interface ServicesPreviewProps {
  data: ServicesPreviewData;
}

const serviceIcons: Record<string, string> = {
  alterations: '✂',
  'custom-bridal': '◆',
  bridesmaid: '◇',
};

export function ServicesPreview({ data }: ServicesPreviewProps) {
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Services"
        headline={data.headline}
        subhead={data.subhead}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        {data.items.map((service) => (
          <Link
            key={service.slug}
            href={service.href}
            className="group block rounded-xl border border-border bg-surface p-8 transition-shadow hover:shadow-md"
            aria-label={`Learn about our ${service.title} service`}
          >
            <span
              className="text-rose text-2xl leading-none"
              aria-hidden="true"
            >
              {serviceIcons[service.slug] ?? '◆'}
            </span>
            <h3 className="font-display text-title text-ink mt-4 group-hover:text-rose transition-colors">
              {service.title}
            </h3>
            <div className="bg-gold mt-3 h-px w-8" aria-hidden="true" />
            <p className="text-body text-ink-muted mt-4 text-pretty">
              {service.summary}
            </p>
            <span className="text-small text-rose mt-6 inline-flex items-center gap-1 font-medium">
              Learn more
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
