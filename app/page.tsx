import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f7] font-sans dark:bg-neutral-950">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold leading-relaxed tracking-tight text-neutral-900 dark:text-neutral-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-neutral-900 dark:text-neutral-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-neutral-900 dark:text-neutral-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/dashboards"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100 md:w-auto"
            aria-label="Go to API keys dashboard"
          >
            Manage API Keys
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100 md:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-solid border-neutral-900 bg-transparent px-6 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900 md:w-auto"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
            <span className="text-neutral-600">→</span>
          </a>
        </div>
      </main>
    </div>
  );
}
