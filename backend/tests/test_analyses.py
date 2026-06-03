CAMPAIGN = (
    "Introducing our boldest campaign yet: premium eco-luxury for everyone. "
    "We claim industry-leading transparency while offering limited-time exclusivity."
)

BRAND = {
    "brand_values": "Transparency, sustainability, community",
    "brand_mission": "Make sustainable products accessible",
    "previous_messaging": "We are committed to honest storytelling and measurable impact",
}


def test_analyze_with_inline_brand(client):
    resp = client.post(
        "/api/v1/analyze",
        json={"campaign_draft": CAMPAIGN, **BRAND},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "analysis_id" in data
    assert len(data["result"]["red_team"]) == 4
    assert data["result"]["brand_consistency"]["alignment_score"] >= 0


def test_analyze_with_profile(client):
    profile_resp = client.post(
        "/api/v1/brand-profiles/",
        json={"name": "Test Brand", **BRAND},
    )
    assert profile_resp.status_code == 201, profile_resp.text
    profile_id = profile_resp.json()["id"]

    resp = client.post(
        "/api/v1/analyze",
        json={"campaign_draft": CAMPAIGN, "brand_profile_id": profile_id},
    )
    assert resp.status_code == 201

    detail = client.get(f"/api/v1/analyses/{resp.json()['analysis_id']}")
    assert detail.status_code == 200
    assert detail.json()["brand_profile_id"] == profile_id
