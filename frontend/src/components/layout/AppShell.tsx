import { Link, Outlet, useLocation } from "react-router-dom";

export function AppShell() {
  const location = useLocation();

  const navClass = (path: string) => {
    const base = "text-sm font-medium transition-colors no-underline";
    const active = location.pathname === path;
    return active ? `${base} text-ink` : `${base} text-muted hover:text-ink`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-xl font-semibold text-ink no-underline">
            Recoil AI
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className={navClass("/")}>
              Home
            </Link>
            <Link to="/analyze" className={navClass("/analyze")}>
              Analyze
            </Link>
            <Link to="/history" className={navClass("/history")}>
              History
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-paper px-6 py-6 text-center text-sm text-muted">
        <p>Campaign red-team analysis · Pre-launch risk assessment</p>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed">
          Scenarios are AI-generated fiction for planning and rehearsal—not legal advice, not
          real-time social monitoring, and not a guarantee of launch outcomes.
        </p>
      </footer>
    </div>
  );
}
