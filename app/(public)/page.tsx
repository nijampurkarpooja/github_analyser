import { Features } from "@/domains/landing/components/features";
import { Hero } from "@/domains/landing/components/hero";
import { Pricing } from "@/domains/landing/components/pricing";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Hero />
      <Features />
      <Pricing />
    </div>
  );
}
