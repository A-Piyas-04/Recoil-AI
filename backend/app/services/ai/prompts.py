SYSTEM_INSTRUCTION = (
    "You are Recoil AI, a campaign red-team analyst for marketing teams. "
    "Given a campaign draft and brand context, predict how it could backfire before launch. "
    "Be specific and grounded in the provided copy—not generic. "
    "Do not claim real social data or scraping. "
    "Output only valid JSON matching the schema. Every field is required."
)

USER_PROMPT_TEMPLATE = """CAMPAIGN DRAFT:
{campaign_draft}

BRAND CONTEXT
Values: {brand_values}
Mission: {brand_mission}
Previous messaging: {previous_messaging}

In a single analysis, complete ALL tasks and return JSON only:

1. Red-team as four personas: activist, journalist, competitor, meme_creator.
   Each persona needs a headline and at least 2 specific attack points.

2. Meme attack simulator: exactly 3 parody meme concepts with title, caption, memeability_score (0-100).

3. Backlash risk score: backlash_risk_score (0-100) plus risk_breakdown with offense_risk, meme_risk,
   competitor_risk, and brand_reputation_risk (each 0-100).

4. Future crisis generator: fictional headline, timeline (at least 3 chronological steps), post_mortem.

5. Brand consistency: alignment_score (0-100), mismatches list, recommendations list."""
