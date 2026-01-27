"use client";

import { classNames } from "@/shared/lib/utils/classnames";
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
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
  const { data: session, status } = useSession();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSignOut = () => {
    signOut();
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
        <nav className="flex h-full flex-col p-4">
          {/* Navigation Items */}
          <div className="flex flex-col gap-1">
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
          </div>

          {/* User Section - Pushed to Bottom */}
          {status === "loading" ? (
            <div className="mt-auto pt-4">
              <div className="h-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ) : session ? (
            <div className="mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-800">
              {/* User Info */}
              <div className="mb-3 flex items-center gap-3 rounded-lg px-4 py-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <UserIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {session.user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className={classNames(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                )}
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
