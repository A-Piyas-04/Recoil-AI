import type { AnalysisResult } from "@/types/analysis";

export function mockAnalysisResult(): AnalysisResult {
  return {
    red_team: [
      {
        persona: "activist",
        headline: "Performance without proof",
        perspective:
          "The campaign promises transformation while avoiding measurable commitments. It reads as aspiration marketing that communities have seen before from brands under scrutiny.",
        key_points: [
          "Sustainability language lacks verifiable targets or third-party audit references",
          "Tone dismisses legitimate concerns raised in recent stakeholder letters",
        ],
      },
      {
        persona: "journalist",
        headline: "A launch built for headlines, thin on facts",
        perspective:
          "Editors will ask what is new versus repackaged. The copy leans on superlatives without documentation, which invites contrast pieces against prior statements and public filings.",
        key_points: [
          "Bold claims are not tied to sources journalists can independently check",
          "Launch timing overlaps with known regulatory review in the category",
        ],
      },
      {
        persona: "competitor",
        headline: "Contrast ads write themselves",
        perspective:
          "Rivals can frame this as premium posturing with hidden caveats. The fine print and pricing footnotes undermine the hero message and create easy side-by-side creative.",
        key_points: [
          "Warranty and value comparisons favor incumbent offers at lower price points",
          "Tagline implies category leadership without substantiated market share data",
        ],
      },
      {
        persona: "meme_creator",
        headline: "Template-ready hypocrisy",
        perspective:
          "The visual and verbal pairing invites remix culture. Recent corporate news gives creators an obvious punchline layer that will spread faster than the official assets.",
        key_points: [
          "Tagline conflicts with widely discussed layoff and cost-cutting coverage",
          "Stock imagery choices match overused corporate dystopia meme formats",
        ],
      },
    ],
    meme_simulator: [
      {
        title: "Expectations vs. Reality",
        caption: "Brand: 'We listen.' Also brand: *ignores 10k comments*",
        explanation:
          "Two-panel format contrasts the slogan with a documented customer-service backlash thread. High recognition, low production effort.",
        memeability_score: 82,
      },
      {
        title: "Drake Hotline Blitz",
        caption: "No: transparent metrics / Yes: cinematic b-roll and buzzwords",
        explanation:
          "Classic template maps rejection of substance to embrace of aesthetic. Works across LinkedIn and X without cultural translation issues.",
        memeability_score: 76,
      },
      {
        title: "Expanding Brain",
        caption: "Sale → Limited drop → 'Movement' → Congressional hearing",
        explanation:
          "Escalation ladder jokes position the campaign as another step toward reputational overreach. Easy to localize with regional politician references.",
        memeability_score: 88,
      },
    ],
    backlash_risk: {
      overall_score: 67,
      offense_risk: 58,
      meme_risk: 74,
      competitor_risk: 52,
      reputation_risk: 61,
      summary:
        "Moderate-to-high backlash potential driven by meme velocity and perceived gap between promise and proof. Offense risk is elevated where identity and values claims lack specificity. Competitor risk is moderate but actionable in paid contrast creative.",
    },
    future_crisis: {
      headline:
        "Weekend statement follows viral clip questioning campaign claims",
      crisis_article:
        "A launch video segment was recirculated with on-screen annotations comparing past executive statements to new copy. Within hours, the clip exceeded official reach on two platforms. By evening, legacy outlets framed the story as a trust gap rather than a product story.\n\nBrand accounts paused promoted posts while communications drafted a holding response. Retail partners requested temporary removal of co-branded in-store assets. Employee advocacy channels went quiet as internal FAQ documents circulated.\n\nAnalysts noted the crisis was predictable: the campaign leaned on transformation language without anchoring proof points consumers could verify in real time. The episode is likely to enter case studies on pre-launch red-teaming.",
      root_cause:
        "Over-indexed on emotional positioning without pre-briefed proof points and without stress-testing against recent news context.",
      prevention_recommendations: [
        "Publish verifiable claims checklist aligned to legal and comms review before launch",
        "Run adversarial persona review on final copy, not concept-stage scripts only",
        "Prepare holding statements and partner talking points for top three failure modes",
        "Align influencer and employee advocacy kits with substantiated message house",
      ],
    },
  };
}
