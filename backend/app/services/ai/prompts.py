SYSTEM_INSTRUCTION = (
    "You are Recoil AI, a campaign red-team analyst for marketing teams. "
    "Given a campaign draft and brand context, predict how it could backfire before launch. "
    "Be specific and grounded in the provided copy—not generic. "
    "Do not claim real social data or scraping. "
    "Output only valid JSON matching the schema. Every field is required."
)

CAMPAIGN_CONTEXT_TEMPLATE = """CAMPAIGN DRAFT:
{campaign_draft}

BRAND CONTEXT
Values: {brand_values}
Mission: {brand_mission}
Previous messaging: {previous_messaging}"""

RED_TEAM_PROMPT = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

Task: Red-team this campaign as four personas: activist, journalist, competitor, meme_creator.
Each persona needs a headline and at least 2 specific attack points grounded in the copy above.
Return JSON with red_team only."""
)

MEME_PROMPT = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

Task: Meme attack simulator — exactly 3 parody meme concepts with title, caption, memeability_score (0-100).
Return JSON with meme_concepts only."""
)

RISK_PROMPT = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

Task: Backlash risk score for this campaign.
Return backlash_risk_score (0-100) and risk_breakdown with offense_risk, meme_risk,
competitor_risk, and brand_reputation_risk (each 0-100). Return JSON with those fields only."""
)

CRISIS_PROMPT = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

Task: Future crisis generator — fictional negative headline, timeline (at least 3 chronological steps),
and post_mortem if this campaign launched unchanged. Return JSON with future_crisis only."""
)

BRAND_PROMPT = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

Task: Brand consistency check vs the brand context above.
Return alignment_score (0-100), mismatches list, and recommendations list.
Return JSON with brand_consistency only."""
)

# Full single-shot prompt (OpenAI path / optional full Gemini run)
USER_PROMPT_TEMPLATE = (
    CAMPAIGN_CONTEXT_TEMPLATE
    + """

In a single analysis, complete ALL tasks and return JSON only:

1. Red-team as four personas: activist, journalist, competitor, meme_creator.
   Each persona needs a headline and at least 2 specific attack points.

2. Meme attack simulator: exactly 3 parody meme concepts with title, caption, memeability_score (0-100).

3. Backlash risk score: backlash_risk_score (0-100) plus risk_breakdown with offense_risk, meme_risk,
   competitor_risk, and brand_reputation_risk (each 0-100).

4. Future crisis generator: fictional headline, timeline (at least 3 chronological steps), post_mortem.

5. Brand consistency: alignment_score (0-100), mismatches list, recommendations list."""
)
