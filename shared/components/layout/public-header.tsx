"use client";

import { classNames } from "@/shared/lib/utils";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { AuthButton } from "../auth";

interface HeaderItem {
  label: string;
  href: string;
}

const headerItems: HeaderItem[] = [
  { label: "Features", href: "#features" },
  { label: "API Playground", href: "#api-playground" },
  { label: "Pricing", href: "#pricing" },
];

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-solid border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <Link
              href="/"
              className="text-xl font-bold text-neutral-900 dark:text-neutral-50"
            >
              CodeSight AI
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {headerItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm md:text-base font-medium text-neutral-900 dark:text-neutral-50 transition-colors hover:text-neutral-600 dark:hover:text-neutral-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <AuthButton />
          </div>
        </div>
      </header>
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      <nav
        className={classNames(
          "fixed left-0 top-16 z-30 w-full transform border-b border-solid border-neutral-200 bg-white transition-transform duration-200 dark:border-neutral-800 dark:bg-neutral-900 md:hidden",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 hover:text-neutral-600 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-400"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
