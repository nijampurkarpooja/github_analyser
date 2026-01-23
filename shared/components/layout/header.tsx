"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface HeaderProps {
  appName: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Header({ appName, onMenuToggle, isMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-solid border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            {appName}
          </Link>
        </div>
      </div>
    </header>
  );
}
