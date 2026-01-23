import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
      <div className="relative z-10 max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            ✨ AI-Powered Code Analysis
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl text-balance">
          Understand Your Code with{" "}
          <span className="bg-linear-to-r from-indigo-500 via-sky-500 to-teal-400 bg-clip-text text-transparent dark:from-indigo-300 dark:via-sky-400 dark:to-teal-200">
            AI Insights
          </span>
        </h1>

        <p className="mb-8 text-base text-neutral-600 dark:text-neutral-400 text-balance sm:text-lg">
          CodeSight AI analyzes your GitHub repositories in seconds. Get
          actionable insights on code quality, security issues, performance
          bottlenecks, and technical debt. Make smarter decisions about your
          codebase.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-neutral-900 px-8 py-3 text-base font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-solid border-neutral-300 bg-white px-8 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800"
          >
            Learn More
          </Link>
        </div>
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1 justify-center">
          <span className="font-medium">No credit card required</span>
          <span>•</span>
          <span className="font-medium">10 free analyses</span>
          <span>•</span>
          <span className="font-medium">Takes 30 seconds</span>
        </p>
      </div>
    </section>
  );
}
