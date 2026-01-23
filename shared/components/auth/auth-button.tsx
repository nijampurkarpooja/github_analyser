"use client";

import {
  DropdownMenuAction,
  DropdownMenuButton,
  DropdownMenuDivider,
  DropdownMenuPanel,
  DropdownMenuRoot,
} from "@/shared/components/ui/dropdown-menu";
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Fragment } from "react/jsx-runtime";

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

export function AuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname.startsWith("/(public)");

  if (status === "loading") {
    return (
      <div className="h-9 w-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
    );
  }

  if (session) {
    return (
      <DropdownMenuRoot>
        <DropdownMenuButton className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || ""}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <UserIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </div>
          )}
        </DropdownMenuButton>
        <DropdownMenuPanel>
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {session.user?.email}
            </p>
          </div>
          <DropdownMenuDivider />
          {isPublicPage &&
            navigationItems.map((item) => (
              <Fragment key={item.href}>
                <DropdownMenuAction asChild key={item.href}>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuAction>
                <DropdownMenuDivider />
              </Fragment>
            ))}
          <DropdownMenuAction
            onClick={() => signOut()}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuAction>
        </DropdownMenuPanel>
      </DropdownMenuRoot>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </button>
  );
}
