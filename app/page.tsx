import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-12">
        <div>
          <h1 className="text-4xl font-bold leading-relaxed text-neutral-900 dark:text-neutral-50">
            Welcome to GitHub Analyser
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Analyze GitHub repositories, manage API keys, and track analytics all in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboards"
            className="group rounded-2xl border border-solid border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              API Keys
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Create and manage your API keys for accessing the GitHub Analyser API.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 transition-transform group-hover:translate-x-1 dark:text-neutral-50">
              Manage Keys →
            </span>
          </Link>

          <Link
            href="/analytics"
            className="group rounded-2xl border border-solid border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Analytics
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              View detailed analytics and insights for your GitHub repositories.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 transition-transform group-hover:translate-x-1 dark:text-neutral-50">
              View Analytics →
            </span>
          </Link>

          <Link
            href="/settings"
            className="group rounded-2xl border border-solid border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Settings
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Configure your preferences and account settings.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 transition-transform group-hover:translate-x-1 dark:text-neutral-50">
              Go to Settings →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
