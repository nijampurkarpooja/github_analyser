import { AppLayout } from "@/shared/components/layout/app-layout";
import { AuthSessionProvider } from "@/shared/components/providers/session-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Analyser",
  description: "Analyze GitHub repositories and manage API keys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <AppLayout appName="GitHub Analyser">{children}</AppLayout>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
