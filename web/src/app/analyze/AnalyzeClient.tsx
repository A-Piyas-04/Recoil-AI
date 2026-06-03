"use client";

import { useState } from "react";

import {
  CampaignForm,
  EMPTY_CAMPAIGN,
} from "@/components/forms/CampaignForm";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { LoadingState } from "@/components/ui/LoadingState";
import type { AnalysisResult, CampaignInput } from "@/types/analysis";

function isFormValid(campaign: CampaignInput): boolean {
  const hasFields =
    campaign.campaign_name.trim() &&
    campaign.slogan.trim() &&
    campaign.campaign_description.trim() &&
    campaign.campaign_copy.trim();
  const length =
    campaign.campaign_description.length + campaign.campaign_copy.length;
  return Boolean(hasFields && length >= 30);
}

export function AnalyzeClient() {
  const [campaign, setCampaign] = useState<CampaignInput>(EMPTY_CAMPAIGN);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid(campaign) || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const err =
          data && typeof data === "object" && "error" in data
            ? String((data as { error: unknown }).error)
            : "Analysis failed";
        throw new Error(err);
      }
      setResult(data as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result) {
    return (
      <ResultsDashboard
        campaign={campaign}
        result={result}
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleAnalyze} className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
          Campaign submission
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Submit draft copy for a full red-team report: adversarial personas,
          meme attack simulation, backlash risk scoring, and a fictional crisis
          scenario.
        </p>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-6 md:p-8">
        <CampaignForm
          value={campaign}
          onChange={setCampaign}
          disabled={loading}
        />
      </div>

      {error ? (
        <p
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? <LoadingState /> : null}

      <button
        type="submit"
        disabled={!isFormValid(campaign) || loading}
        className="rounded-sm bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {loading ? "Analyzing…" : "Analyze campaign"}
      </button>
    </form>
  );
}
