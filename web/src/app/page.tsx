import Link from "next/link";

import { Header } from "@/components/layout/Header";

const FEATURES = [
  {
    title: "AI red-team analysis",
    description:
      "Activist, journalist, competitor, and meme-creator perspectives on your draft.",
  },
  {
    title: "Meme attack simulator",
    description:
      "Three parody concepts with captions, explanations, and memeability scores.",
  },
  {
    title: "Backlash risk score",
    description:
      "0–100 composite with offense, meme, competitor, and reputation breakdown.",
  },
  {
    title: "Future crisis generator",
    description:
      "Fictional headline, crisis article, root cause, and prevention steps.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              Pre-launch risk intelligence
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 md:text-5xl">
              Predict campaign backlash before you launch
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              Faultline AI stress-tests marketing campaigns with adversarial
              personas, meme simulations, structured risk scoring, and
              fictional crisis scenarios — so comms teams can fix vulnerabilities
              in the draft room, not on the timeline.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/analyze"
                className="inline-flex rounded-sm bg-stone-900 px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-stone-800"
              >
                Analyze a campaign
              </Link>
              <a
                href="#capabilities"
                className="inline-flex rounded-sm border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 no-underline transition-colors hover:bg-stone-50"
              >
                View capabilities
              </a>
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="mx-auto max-w-6xl px-6 py-16 md:py-20"
        >
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Assessment modules
          </h2>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            One structured report per submission — designed for comms and brand
            risk workflows.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.title}
                className="border border-stone-200 bg-white p-6"
              >
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm text-stone-600">
              Configure{" "}
              <code className="rounded-sm bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">
                AI_PROVIDER
              </code>{" "}
              as{" "}
              <code className="rounded-sm bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">
                openai
              </code>{" "}
              or{" "}
              <code className="rounded-sm bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">
                gemini
              </code>
              . Use{" "}
              <code className="rounded-sm bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">
                AI_MOCK_MODE=true
              </code>{" "}
              for demo data without API keys.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
