import { Link } from "react-router-dom";

const features = [
  "Red-team personas",
  "Meme attack simulator",
  "Backlash risk score",
  "Future crisis generator",
];

export function HomePage() {
  return (
    <div className="max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
        Campaign red-team
      </p>
      <h1 className="font-serif text-4xl font-semibold leading-tight text-ink">
        Predict backlash before you launch
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Recoil AI stress-tests your marketing campaign with adversarial personas, meme
        simulations, risk scoring, and crisis scenarios—in one analysis pass.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {features.map((f) => (
          <li
            key={f}
            className="rounded-full border border-border bg-paper px-3 py-1 text-sm text-ink"
          >
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/analyze"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-accent-hover"
      >
        Analyze a campaign
      </Link>
    </div>
  );
}
