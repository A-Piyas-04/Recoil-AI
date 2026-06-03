import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group no-underline">
          <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">
            Faultline <span className="text-stone-500">AI</span>
          </span>
          <span className="mt-0.5 block text-xs uppercase tracking-widest text-stone-500">
            Campaign red-team
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link
            href="/"
            className="no-underline transition-colors hover:text-stone-900"
          >
            Overview
          </Link>
          <Link
            href="/analyze"
            className="no-underline transition-colors hover:text-stone-900"
          >
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
}
