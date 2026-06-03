import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandConsistencySection } from "../components/results/BrandConsistencySection";
import { CrisisSection } from "../components/results/CrisisSection";
import { MemeSimulatorSection } from "../components/results/MemeSimulatorSection";
import { RedTeamSection } from "../components/results/RedTeamSection";
import { RiskScoreSection } from "../components/results/RiskScoreSection";
import { api } from "../lib/api";
import type { AnalysisDetail } from "../types/analysis";

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<AnalysisDetail>(`/api/v1/analyses/${id}`)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-muted">Loading results…</p>;
  }

  if (error || !data) {
    return (
      <div>
        <p className="text-risk-high">{error ?? "Analysis not found"}</p>
        <Link to="/history" className="mt-4 inline-block text-sm font-medium text-accent no-underline hover:underline">
          Back to history
        </Link>
      </div>
    );
  }

  const { result } = data;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Analysis complete
          </p>
          <h1 className="font-serif text-3xl font-semibold text-ink">Campaign red-team report</h1>
          <p className="mt-1 text-sm text-muted">
            {new Date(data.created_at).toLocaleString()} · Risk {data.backlash_risk_score}/100
          </p>
        </div>
        <Link
          to="/analyze"
          className="rounded-md border border-border bg-paper px-4 py-2 text-sm font-medium text-ink no-underline hover:border-accent"
        >
          New analysis
        </Link>
      </header>

      <details className="rounded-lg border border-border bg-paper px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-muted">
          Campaign inputs reviewed
        </summary>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-ink">Campaign draft</dt>
            <dd className="whitespace-pre-wrap text-muted">{data.campaign_draft}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Brand values</dt>
            <dd className="whitespace-pre-wrap text-muted">{data.brand_values}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Brand mission</dt>
            <dd className="whitespace-pre-wrap text-muted">{data.brand_mission}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Previous messaging</dt>
            <dd className="whitespace-pre-wrap text-muted">{data.previous_messaging}</dd>
          </div>
        </dl>
      </details>

      <RiskScoreSection score={result.backlash_risk_score} breakdown={result.risk_breakdown} />
      <RedTeamSection redTeam={result.red_team} />
      <MemeSimulatorSection memes={result.meme_concepts} />
      <CrisisSection crisis={result.future_crisis} />
      <BrandConsistencySection consistency={result.brand_consistency} />
    </div>
  );
}
