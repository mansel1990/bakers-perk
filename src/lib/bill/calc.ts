/** Parse quantity strings like "9", "9 Kg", "9.5kg" into kilograms. */
export function parseQuantityKg(quantity: string): number | null {
  const trimmed = quantity.trim().toLowerCase();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:kg|kgs?)?$/);
  if (match) return parseFloat(match[1]);

  const num = parseFloat(trimmed.replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : null;
}

/** Parse rate-per-kg field (digits and optional decimal). */
export function parseRatePerKg(rate: string): number | null {
  const trimmed = rate.trim();
  if (!trimmed) return null;

  const num = parseFloat(trimmed.replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : null;
}

/** Auto-calculate line amount from quantity (kg) × rate per kg. */
export function computeLineAmount(quantity: string, rate: string): number {
  const qty = parseQuantityKg(quantity);
  const rateNum = parseRatePerKg(rate);
  if (qty == null || rateNum == null) return 0;
  return Math.round(qty * rateNum);
}
