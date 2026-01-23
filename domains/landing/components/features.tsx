import {
  ArrowPathIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Repository Insights",
    description:
      "Get a clear, AI-generated understanding of what a repository does, who it's for, and how it's used.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Repository Snapshot",
    description:
      "Instant visibility into stars, activity, license, languages, and overall project maturity.",
  },
  {
    icon: ExclamationTriangleIcon,
    title: "Health & Risk Signals",
    description:
      "Surface maintenance gaps, issue backlogs, and adoption risks using real repository signals.",
  },
  {
    icon: ChartBarIcon,
    title: "Activity & Community Analysis",
    description:
      "See if a project is actively maintained through contributor activity and issue movement.",
  },
  {
    icon: ArrowPathIcon,
    title: "Clear Adoption Recommendations",
    description:
      "Know whether to use a project, proceed with caution, fork it, or avoid it — with reasoning.",
  },
  {
    icon: KeyIcon,
    title: "API-First Access",
    description:
      "Analyze repositories via API keys or dashboard with transparent usage limits.",
  },
];

const iconGradientVariants = [
  "from-blue-100 via-indigo-100 to-sky-100",
  "from-amber-100 via-orange-100 to-yellow-100",
  "from-emerald-100 via-teal-100 to-green-100",
  "from-slate-100 via-neutral-100 to-gray-100",
  "from-blue-100 via-sky-100 to-indigo-100",
  "from-violet-100 via-purple-100 to-indigo-100",
] as const;

const iconColorVariants = [
  "text-blue-600 dark:text-blue-400",
  "text-amber-600 dark:text-amber-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-slate-600 dark:text-slate-400",
  "text-blue-600 dark:text-blue-400",
  "text-violet-600 dark:text-violet-400",
] as const;

const hoverBorderVariants = [
  "hover:border-blue-200 dark:hover:border-blue-800/50",
  "hover:border-amber-200 dark:hover:border-amber-800/50",
  "hover:border-emerald-200 dark:hover:border-emerald-800/50",
  "hover:border-slate-200 dark:hover:border-slate-800/50",
  "hover:border-blue-200 dark:hover:border-blue-800/50",
  "hover:border-violet-200 dark:hover:border-violet-800/50",
] as const;

export function Features() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 border-t border-neutral-200/50 dark:border-neutral-800/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-center mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            Everything you need to understand and improve your codebase at a
            glance.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative flex flex-col gap-4 rounded-lg border border-neutral-200/50 bg-linear-to-br from-neutral-50 via-white to-indigo-50/30 p-6 dark:border-neutral-800/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 transition-all duration-300 ${hoverBorderVariants[index]} hover:shadow-lg hover:shadow-neutral-100/50 dark:hover:shadow-neutral-950/20`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${iconGradientVariants[index]} dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800 ring-1 ring-neutral-200/50 dark:ring-neutral-800/30 group-hover:ring-opacity-60 transition-all`}
                >
                  <Icon className={`h-6 w-6 ${iconColorVariants[index]}`} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  {feature.title}
                </h3>
                <p className="text-sm lg:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
