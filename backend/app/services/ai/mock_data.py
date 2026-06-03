from app.schemas.analysis import AnalysisResult


def mock_analysis_result() -> AnalysisResult:
    return AnalysisResult.model_validate(
        {
            "red_team": [
                {
                    "persona": "activist",
                    "headline": "Greenwashing dressed as progress",
                    "attacks": [
                        "Vague sustainability claims without measurable targets",
                        "Campaign ignores supply-chain labor concerns raised last quarter",
                    ],
                },
                {
                    "persona": "journalist",
                    "headline": "PR spin meets inconvenient facts",
                    "attacks": [
                        "No third-party verification for bold performance claims",
                        "Timing coincides with pending regulatory scrutiny",
                    ],
                },
                {
                    "persona": "competitor",
                    "headline": "Easy contrast ads write themselves",
                    "attacks": [
                        "Premium pricing narrative undermined by discount footnotes",
                        "Competitors can highlight longer warranties at lower cost",
                    ],
                },
                {
                    "persona": "meme_creator",
                    "headline": "Template-ready hypocrisy",
                    "attacks": [
                        "Tagline pairs poorly with recent layoff headlines",
                        "Visual metaphor invites corporate dystopia remixes",
                    ],
                },
            ],
            "meme_concepts": [
                {
                    "title": "Expectations vs Reality",
                    "caption": "Brand: 'We listen.' Also brand: *ignores 10k comments*",
                    "memeability_score": 82,
                },
                {
                    "title": "Drake Hotline",
                    "caption": "No: transparent metrics / Yes: cinematic b-roll and buzzwords",
                    "memeability_score": 76,
                },
                {
                    "title": "Expanding Brain",
                    "caption": "Sale → Limited drop → 'Movement' → Congressional hearing",
                    "memeability_score": 88,
                },
            ],
            "backlash_risk_score": 67,
            "risk_breakdown": {
                "offense_risk": 58,
                "meme_risk": 74,
                "competitor_risk": 52,
                "brand_reputation_risk": 61,
            },
            "future_crisis": {
                "headline": "Faultline AI Mock: Viral clip forces weekend statement",
                "timeline": [
                    "T+0h: Launch post hits algorithmic boost",
                    "T+4h: Activist stitch video hits 2M views",
                    "T+12h: Hashtag trends in three markets",
                    "T+24h: Legacy media picks up contrast with prior messaging",
                    "T+48h: Retail partners request pause on co-branded assets",
                ],
                "post_mortem": "Internal review would cite over-indexing on aspiration without proof points.",
            },
            "brand_consistency": {
                "alignment_score": 54,
                "mismatches": [
                    "Tone shifts from humble community voice to aggressive dominance",
                    "New claims exceed commitments in prior messaging archive",
                ],
                "recommendations": [
                    "Add verifiable proof points aligned with stated brand values",
                    "Reference continuity with prior mission language explicitly",
                ],
            },
        }
    )
