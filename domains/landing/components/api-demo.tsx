"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_PAYLOAD = {
  githubUrl: "https://github.com/assafelovic/gpt-researcher",
};

const DEFAULT_RESPONSE = {
  summary:
    "The 'gpt-researcher' repository is designed to facilitate research using GPT models. It provides tools and resources for users to conduct various research tasks efficiently. The README outlines the project's purpose, installation instructions, usage guidelines, and contributions. It emphasizes the importance of leveraging AI for research and offers examples of how to utilize the tools provided in the repository.",
  cool_facts: [
    "The repository includes detailed instructions for installation and usage, making it accessible for users of all skill levels.",
    "It emphasizes the integration of AI in research, showcasing the potential of GPT models in various academic and professional fields.",
    "The project encourages community contributions, allowing users to enhance the tools and share their findings.",
  ],
};

export function ApiDemo() {
  const [payload, setPayload] = useState<string>(
    JSON.stringify(DEFAULT_PAYLOAD, null, 2)
  );
  const response = JSON.stringify(DEFAULT_RESPONSE, null, 2);

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    if (session) {
      router.push("/api-playground");
    } else {
      router.push("/auth");
    }
  };

  return (
    <section
      id="api-demo"
      className="py-16 sm:py-24 border-t border-neutral-200/50 dark:border-neutral-800/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            API Demo
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Try out the API demo to see how it works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-16">
          <div className="rounded-2xl border border-solid border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-50 flex gap-1 items-center">
                  GitHub URL
                  <span className="text-neutral-500 dark:text-neutral-400">
                    (Edit the payload and send a request)
                  </span>
                </label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={10}
                  placeholder="Enter the GitHub URL"
                  required
                  aria-label="GitHub URL"
                  className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100 self-end"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-solid border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-50 flex gap-1 items-center">
                  API Response
                </label>
                <textarea
                  value={response}
                  readOnly
                  rows={10}
                  className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
