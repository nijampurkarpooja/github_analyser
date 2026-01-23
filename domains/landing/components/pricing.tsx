import { classNames } from "@/shared/lib/utils";
import Link from "next/link";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceMeta?: string;
  features: Array<{ text: string; included: boolean }>;
  badge?: string;
  cta: {
    text: string;
    href?: string;
    variant: "default" | "outline";
    meta?: string;
    disabled?: boolean;
  };
  featured?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "For exploring and learning",
    price: "Free",
    priceMeta: "forever",
    features: [
      { text: "10 repository analyses per month", included: true },
      { text: "AI repository summary", included: true },
      { text: "Health & risk signals", included: true },
      { text: "Adoption recommendations", included: true },
      { text: "API access", included: false },
      { text: "Analysis history", included: false },
    ],
    cta: {
      text: "Get Started",
      href: "/signup",
      variant: "default",
      meta: "No credit card required",
    },
    featured: true,
  },
  {
    name: "Pro",
    description: "For regular evaluations and decision-making",
    price: "$19",
    priceMeta: "per month",
    features: [
      { text: "200 repository analyses per month", included: true },
      { text: "AI repository summary", included: true },
      { text: "Health & risk signals", included: true },
      { text: "Adoption recommendations", included: true },
      { text: "API access", included: true },
      { text: "Analysis history", included: true },
    ],
    cta: {
      text: "Coming Soon",
      variant: "outline",
      disabled: true,
    },
    badge: "Coming Soon",
  },
  {
    name: "Team",
    description: "For teams evaluating multiple projects",
    price: "$49",
    priceMeta: "per month",
    features: [
      { text: "1,000 repository analyses per month", included: true },
      { text: "Everything in Pro", included: true },
      { text: "Higher API rate limits", included: true },
      { text: "Priority analysis queue", included: true },
    ],
    cta: {
      text: "Coming Soon",
      variant: "outline",
      disabled: true,
    },
    badge: "Coming Soon",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 border-t border-neutral-200/50 dark:border-neutral-800/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Choose the plan that fits your needs
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={classNames(
                "group relative flex flex-col gap-6 rounded-lg border p-6 sm:p-8 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-800/50 hover:shadow-lg hover:shadow-neutral-100/50 dark:hover:shadow-neutral-950/20",
                tier.featured
                  ? "border-2 border-blue-200/50 bg-linear-to-br from-blue-50/40 via-indigo-50/30 to-sky-50/40 dark:border-blue-800/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-sky-950/20 ring-2 ring-blue-200/30 dark:ring-blue-800/20 scale-102"
                  : "border-neutral-200/50 bg-linear-to-br from-neutral-50 via-white to-slate-50/40 dark:border-neutral-800/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-slate-950/20 ring-0 dark:ring-neutral-800/20"
              )}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0 rounded-bl-lg bg-linear-to-br from-blue-500 to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white dark:from-blue-600 dark:to-indigo-600">
                  {tier.badge}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {tier.name}
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {tier.description}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                  {tier.price}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {tier.priceMeta}
                </span>
              </div>
              <div className="flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <span
                      className={`text-lg font-semibold ${feature.included ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-600"} mt-0.5 shrink-0`}
                    >
                      {feature.included ? "✓" : "✗"}
                    </span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              {tier.cta.disabled ? (
                <button
                  className="w-full rounded-lg border border-neutral-300 bg-white px-6 py-3 text-center text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  {tier.cta.text}
                  <span className="text-xs text-neutral-500 dark:text-neutral-500">
                    {tier.cta.meta}
                  </span>
                </button>
              ) : (
                <Link
                  href={tier.cta.href ?? ""}
                  className={`w-full rounded-lg border border-neutral-300 bg-white px-6 py-3 text-center text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 ${tier.cta.variant === "default" ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600" : ""}`}
                >
                  {tier.cta.text}
                </Link>
              )}
              {tier.cta.meta && (
                <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center">
                  {tier.cta.meta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
