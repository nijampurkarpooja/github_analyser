"use client";

import { classNames } from "@/shared/lib/utils/classnames";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}

export function DropdownMenuRoot({ children }: DropdownMenuProps) {
  return <DropdownMenu>{children}</DropdownMenu>;
}

export function DropdownMenuButton({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      className={classNames("outline-none focus:outline-none", className)}
      {...props}
    >
      {children}
    </DropdownMenuTrigger>
  );
}

export function DropdownMenuPanel({
  children,
  align = "end",
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      align={align}
      sideOffset={8}
      className={classNames(
        "min-w-[200px] rounded-lg border border-neutral-200 bg-white p-1 shadow-lg",
        "dark:border-neutral-800 dark:bg-neutral-900",
        "animate-in fade-in-0 zoom-in-95"
      )}
      {...props}
    >
      {children}
    </DropdownMenuContent>
  );
}

export function DropdownMenuAction({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      className={classNames(
        "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium",
        "text-neutral-900 outline-none transition-colors",
        "hover:bg-neutral-100 focus:bg-neutral-100",
        "dark:text-neutral-50 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  );
}

export function DropdownMenuDivider() {
  return (
    <DropdownMenuSeparator className="my-1 h-px bg-neutral-200 dark:bg-neutral-800" />
  );
}
