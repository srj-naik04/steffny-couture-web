/**
 * Filters — Phase 4
 *
 * Client component. Manages filter state via URL search params so that
 * filters are preserved on refresh and shareable.
 *
 * Filters:
 *   category  — multi-select chips
 *   colour    — multi-select chips
 *   occasion  — multi-select chips
 *   maxPrice  — single slider
 */

'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { formatGBP } from '@/lib/currency';
import type { FilterState } from './filters-helpers';

export type { FilterState };

interface FiltersProps {
  allCategories: string[];
  allColours: string[];
  allOccasions: string[];
  maxPriceRange: number;
  currentFilters: FilterState;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-11 rounded-full border px-3 py-1.5 text-small font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        active
          ? 'border-rose bg-rose text-ivory'
          : 'border-border bg-surface text-ink hover:border-border-strong',
      )}
    >
      {label}
    </button>
  );
}

function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Filters({
  allCategories,
  allColours,
  allOccasions,
  maxPriceRange,
  currentFilters,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const hasActiveFilters =
    currentFilters.categories.length > 0 ||
    currentFilters.colours.length > 0 ||
    currentFilters.occasions.length > 0 ||
    currentFilters.maxPrice < maxPriceRange;

  function updateParams(updates: Partial<FilterState>) {
    const params = new URLSearchParams(searchParams.toString());
    const next = { ...currentFilters, ...updates };

    if (next.categories.length > 0) {
      params.set('category', next.categories.join(','));
    } else {
      params.delete('category');
    }

    if (next.colours.length > 0) {
      params.set('colour', next.colours.join(','));
    } else {
      params.delete('colour');
    }

    if (next.occasions.length > 0) {
      params.set('occasion', next.occasions.join(','));
    } else {
      params.delete('occasion');
    }

    if (next.maxPrice < maxPriceRange) {
      params.set('maxPrice', String(next.maxPrice));
    } else {
      params.delete('maxPrice');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleMulti(
    key: 'categories' | 'colours' | 'occasions',
    value: string,
  ) {
    const current = currentFilters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <Chip
              key={cat}
              label={capitalise(cat)}
              active={currentFilters.categories.includes(cat)}
              onClick={() => toggleMulti('categories', cat)}
            />
          ))}
        </div>
      </div>

      {/* Colour */}
      <div>
        <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
          Colour
        </p>
        <div className="flex flex-wrap gap-2">
          {allColours.map((colour) => (
            <Chip
              key={colour}
              label={capitalise(colour)}
              active={currentFilters.colours.includes(colour)}
              onClick={() => toggleMulti('colours', colour)}
            />
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
          Occasion
        </p>
        <div className="flex flex-wrap gap-2">
          {allOccasions.map((occ) => (
            <Chip
              key={occ}
              label={capitalise(occ)}
              active={currentFilters.occasions.includes(occ)}
              onClick={() => toggleMulti('occasions', occ)}
            />
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
          Max price: {formatGBP(currentFilters.maxPrice)}
        </p>
        <input
          type="range"
          min={0}
          max={maxPriceRange}
          step={50}
          value={currentFilters.maxPrice}
          onChange={(e) => updateParams({ maxPrice: Number(e.target.value) })}
          aria-label="Maximum price filter"
          className="w-full accent-rose"
        />
        <div className="text-label text-ink-subtle mt-1 flex justify-between">
          <span>{formatGBP(0)}</span>
          <span>{formatGBP(maxPriceRange)}</span>
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-small text-rose font-medium underline underline-offset-2 hover:text-rose-dark"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-small font-medium transition-colors hover:bg-surface-alt"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] text-ivory">
              {currentFilters.categories.length +
                currentFilters.colours.length +
                currentFilters.occasions.length +
                (currentFilters.maxPrice < maxPriceRange ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-small text-rose font-medium underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile expandable panel */}
      {mobileOpen && (
        <div className="mb-8 rounded-xl border border-border bg-surface p-5 lg:hidden">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{filterContent}</div>
    </>
  );
}

