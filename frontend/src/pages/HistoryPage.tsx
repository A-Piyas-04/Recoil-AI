import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { AnalysisSummary } from "../types/analysis";

function riskBadgeClass(score: number): string {
  if (score >= 70) return "bg-risk-high/10 text-risk-high";
  if (score >= 40) return "bg-risk-mid/10 text-risk-mid";
  return "bg-risk-low/10 text-risk-low";
}

export function HistoryPage() {
  const [items, setItems] = useState<AnalysisSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<AnalysisSummary[]>("/api/v1/analyses")
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Analysis history</h1>
      <p className="mt-2 text-muted">Past campaign red-team runs in your workspace.</p>

      {loading && <p className="mt-6 text-muted">Loading…</p>}
      {error && <p className="mt-6 text-risk-high">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="mt-6 text-muted">
          No analyses yet.{" "}
          <Link to="/analyze" className="font-medium text-accent">
            Run your first campaign scan
          </Link>
          .
        </p>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-paper">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{item.campaign_snippet}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-semibold ${riskBadgeClass(item.backlash_risk_score)}`}
                    >
                      {item.backlash_risk_score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/results/${item.id}`}
                      className="font-medium text-accent no-underline hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
