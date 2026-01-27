import { AuthForm } from "@/domains/auth/components";
import { authOptions } from "@/domains/auth/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already authenticated
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
