import type { MenuPricing } from "@/lib/data";

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Props = {
  pricing: MenuPricing;
  /** Tighter layout for search rows and narrow columns */
  compact?: boolean;
};

export default function MenuPrice({ pricing, compact }: Props) {
  if (pricing.kind === "on-request") {
    return <span className="text-sm italic text-muted">Enquire for price</span>;
  }

  if (pricing.kind === "single") {
    return (
      <span className="text-sm font-semibold tabular-nums text-accent lg:text-base">
        {INR(pricing.priceInr)}
      </span>
    );
  }

  if (compact) {
    return (
      <span className="flex flex-wrap justify-end gap-1.5">
        {pricing.variants.map((v) => (
          <span
            key={v.label}
            className="inline-flex items-baseline gap-1 rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] lg:text-xs"
          >
            <span className="text-muted">{v.label}</span>
            <span className="font-semibold tabular-nums text-accent">{INR(v.priceInr)}</span>
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {pricing.variants.map((v) => (
        <div key={v.label} className="flex items-baseline gap-2.5 text-sm lg:text-[15px]">
          <span className="min-w-[2.25rem] text-right text-[11px] font-medium uppercase tracking-wide text-muted">
            {v.label}
          </span>
          <span className="min-w-[4.25rem] font-semibold tabular-nums text-accent">{INR(v.priceInr)}</span>
        </div>
      ))}
    </div>
  );
}
