import { Footer } from "@/shared/components/layout";
import { PublicHeader } from "@/shared/components/layout/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] dark:bg-neutral-950">
      <PublicHeader />
      <div className="flex flex-1">
        <main className="flex-1 lg:ml-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
