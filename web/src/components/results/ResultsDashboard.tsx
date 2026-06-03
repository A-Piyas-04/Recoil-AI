import type { AnalysisResult, CampaignInput } from "@/types/analysis";
import { CrisisSection } from "@/components/results/CrisisSection";
import { MemeSimulatorSection } from "@/components/results/MemeSimulatorSection";
import { RedTeamSection } from "@/components/results/RedTeamSection";
import { RiskScoreSection } from "@/components/results/RiskScoreSection";

interface ResultsDashboardProps {
  campaign: CampaignInput;
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsDashboard({
  campaign,
  result,
  onReset,
}: ResultsDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Analysis complete
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-stone-900">
            {campaign.campaign_name}
          </h2>
          {campaign.slogan ? (
            <p className="mt-2 text-sm italic text-stone-600">
              &ldquo;{campaign.slogan}&rdquo;
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="self-start rounded-sm border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          New analysis
        </button>
      </div>

      <RiskScoreSection risk={result.backlash_risk} />
      <RedTeamSection personas={result.red_team} />
      <MemeSimulatorSection concepts={result.meme_simulator} />
      <CrisisSection crisis={result.future_crisis} />
    </div>
  );
}
