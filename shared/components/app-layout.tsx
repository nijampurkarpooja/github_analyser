"use client";

import { useState } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { SideNavigation } from "./side-navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  appName: string;
}

export function AppLayout({ children, appName }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] dark:bg-neutral-950">
      <Header
        appName={appName}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
      />
      <div className="flex flex-1">
        <SideNavigation isOpen={isMenuOpen} onClose={handleMenuClose} />
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
