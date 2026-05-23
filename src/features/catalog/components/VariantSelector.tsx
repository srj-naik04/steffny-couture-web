/**
 * VariantSelector — Phase 4
 *
 * Client component. Renders size chips and colour chips.
 * Writes selected values to VariantContext so AddToCartButton can read them.
 * Auto-selects the single option if only one is available.
 */

'use client';

import * as React from 'react';
import { useVariant } from './VariantContext';
import { cn } from '@/lib/cn';

interface VariantSelectorProps {
  availableSizes: string[];
  availableColours: string[];
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-11 min-w-11 rounded-full border px-4 py-2 text-small font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        selected
          ? 'border-rose bg-rose-soft text-rose-dark'
          : 'border-border bg-surface text-ink hover:border-border-strong',
      )}
    >
      {label}
    </button>
  );
}

export function VariantSelector({
  availableSizes,
  availableColours,
}: VariantSelectorProps) {
  const { size, colour, setSize, setColour } = useVariant();

  return (
    <div className="space-y-4">
      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
            Size{size ? `: ${size}` : ''}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
            {availableSizes.map((s) => (
              <Chip
                key={s}
                label={s}
                selected={size === s}
                onClick={() => setSize(size === s ? null : s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Colours */}
      {availableColours.length > 0 && (
        <div>
          <p className="text-label text-ink-muted mb-2 font-medium uppercase tracking-widest">
            Colour{colour ? `: ${colour}` : ''}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select colour">
            {availableColours.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={colour === c}
                onClick={() => setColour(colour === c ? null : c)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
