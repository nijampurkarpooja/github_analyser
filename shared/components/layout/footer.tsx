export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-solid border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            &copy; {currentYear} CodeSight AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              GitHub
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
