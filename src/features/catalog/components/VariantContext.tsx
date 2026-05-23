/**
 * VariantContext — Phase 4
 *
 * Lightweight React context shared between VariantSelector and AddToCartButton
 * so both client components can read the selected size + colour without prop
 * drilling through the server component tree.
 */

'use client';

import * as React from 'react';

interface VariantState {
  size: string | null;
  colour: string | null;
  setSize: (size: string | null) => void;
  setColour: (colour: string | null) => void;
}

const VariantContext = React.createContext<VariantState>({
  size: null,
  colour: null,
  setSize: () => undefined,
  setColour: () => undefined,
});

export function VariantProvider({
  children,
  defaultSize,
  defaultColour,
}: {
  children: React.ReactNode;
  defaultSize?: string | null;
  defaultColour?: string | null;
}) {
  const [size, setSize] = React.useState<string | null>(defaultSize ?? null);
  const [colour, setColour] = React.useState<string | null>(
    defaultColour ?? null,
  );

  return (
    <VariantContext.Provider value={{ size, colour, setSize, setColour }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  return React.useContext(VariantContext);
}
