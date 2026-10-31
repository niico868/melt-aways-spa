import { SITE } from "@/lib/site";

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <img
      src={SITE.logoMEA}
      alt="Melt Elite Aesthetics"
      className={`${className} [filter:contrast(1.15)_saturate(1.35)_drop-shadow(0_1px_2px_rgba(0,0,0,0.08))]`}
    />
  );
}