/**
 * Cart utility helpers — Phase 5
 */

/**
 * Compose a descriptive alt text for a cart item thumbnail.
 * Includes size and colour when present.
 * Example: "Mauve Sequin Mermaid Gown, L, Mauve"
 */
export function describeCartItem(item: {
  name: string;
  size?: string | null;
  colour?: string | null;
}): string {
  return [item.name, item.size, item.colour].filter(Boolean).join(', ');
}
