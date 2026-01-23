"use client";

import { classNames } from "@/shared/lib/utils/classnames";
import {
  ChartBarIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { name: "API Keys", href: "/dashboard", icon: KeyIcon },
  { name: "API Playground", href: "/api-playground", icon: CodeBracketIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={classNames(
          "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r border-solid border-neutral-200 bg-white transition-transform duration-200 dark:border-neutral-800 dark:bg-neutral-900",
          "lg:static lg:top-0 lg:h-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={classNames(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-950 dark:hover:text-neutral-50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
