import { AppLayout } from "@/shared/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout appName="CodeSight AI">{children}</AppLayout>;
}
