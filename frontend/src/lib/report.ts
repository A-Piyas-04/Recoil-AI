import type { AnalysisDetail } from "../types/analysis";
import { PERSONA_LABELS } from "../types/analysis";

export function formatAnalysisReport(data: AnalysisDetail): string {
  const { result } = data;
  const lines: string[] = [
    "RECOIL AI — CAMPAIGN RED-TEAM REPORT",
    `Generated: ${new Date(data.created_at).toLocaleString()}`,
    `Backlash risk score: ${result.backlash_risk_score}/100`,
    "",
    "— CAMPAIGN DRAFT —",
    data.campaign_draft,
    "",
    "— BRAND CONTEXT —",
    `Values: ${data.brand_values}`,
    `Mission: ${data.brand_mission}`,
    `Previous messaging: ${data.previous_messaging}`,
    "",
    "— BACKLASH RISK BREAKDOWN —",
    `Offense: ${result.risk_breakdown.offense_risk}/100`,
    `Meme: ${result.risk_breakdown.meme_risk}/100`,
    `Competitor: ${result.risk_breakdown.competitor_risk}/100`,
    `Brand reputation: ${result.risk_breakdown.brand_reputation_risk}/100`,
    "",
    "— RED-TEAM —",
  ];

  for (const critique of result.red_team) {
    lines.push(`${PERSONA_LABELS[critique.persona].toUpperCase()}: ${critique.headline}`);
    critique.attacks.forEach((a) => lines.push(`  • ${a}`));
    lines.push("");
  }

  lines.push("— MEME ATTACK SIMULATOR —");
  result.meme_concepts.forEach((m, i) => {
    lines.push(`Meme #${i + 1}: ${m.title}`);
    lines.push(`Caption: ${m.caption}`);
    lines.push(`Memeability: ${m.memeability_score}/100`);
    lines.push("");
  });

  lines.push("— FUTURE CRISIS —");
  lines.push(result.future_crisis.headline);
  result.future_crisis.timeline.forEach((step) => lines.push(`  ${step}`));
  lines.push(`Post-mortem: ${result.future_crisis.post_mortem}`);
  lines.push("");
  lines.push("— BRAND CONSISTENCY —");
  lines.push(`Alignment: ${result.brand_consistency.alignment_score}/100`);
  result.brand_consistency.mismatches.forEach((m) => lines.push(`Mismatch: ${m}`));
  result.brand_consistency.recommendations.forEach((r) => lines.push(`Recommendation: ${r}`));
  lines.push("");
  lines.push(
    "Disclaimer: Fictional red-team scenarios for pre-launch planning only. Not legal or PR advice.",
  );

  return lines.join("\n");
}
