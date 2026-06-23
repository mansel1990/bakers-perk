/** Rs 10800 — matches sample bill formatting (no ₹ symbol). */
export function billRs(n: number): string {
  return `Rs ${Math.round(n).toLocaleString("en-IN")}`;
}

/** April 29 2026 — matches sample bill date style. */
export function billDisplayDate(isoOrDisplay: string): string {
  const trimmed = isoOrDisplay.trim();
  if (!trimmed) return "";

  const parsed = new Date(trimmed.includes("T") ? trimmed : `${trimmed}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return trimmed;

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function phoneForBill(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) return digits.slice(2);
  return digits;
}

export function instagramForBill(instagram: string): string {
  const match = instagram.match(/instagram\.com\/([^/?#]+)/i);
  if (match?.[1]) return match[1];
  return instagram.replace(/^@/, "").trim();
}
