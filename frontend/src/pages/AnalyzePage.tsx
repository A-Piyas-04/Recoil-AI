import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { BrandProfileForm, type BrandProfileFormValues } from "../components/forms/BrandProfileForm";
import { BrandProfileSelect } from "../components/forms/BrandProfileSelect";
import { CampaignForm } from "../components/forms/CampaignForm";
import { useAnalysis } from "../hooks/useAnalysis";
import type { BrandProfile } from "../types/analysis";

const emptyBrand: BrandProfileFormValues = {
  name: "",
  brand_values: "",
  brand_mission: "",
  previous_messaging: "",
};

export function AnalyzePage() {
  const { submit, loading, error } = useAnalysis();
  const [campaign, setCampaign] = useState("");
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [brand, setBrand] = useState<BrandProfileFormValues>(emptyBrand);
  const [saveProfile, setSaveProfile] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<BrandProfile[]>("/api/v1/brand-profiles/")
      .then(setProfiles)
      .catch(() => setProfiles([]));
  }, []);

  const useProfile = Boolean(selectedProfileId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (campaign.trim().length < 50) {
      setValidationError("Campaign draft must be at least 50 characters.");
      return;
    }

    let brandProfileId = selectedProfileId || undefined;

    if (saveProfile && !useProfile) {
      if (!brand.name.trim()) {
        setValidationError("Enter a profile name to save this brand context.");
        return;
      }
      try {
        const created = await api.post<BrandProfile>("/api/v1/brand-profiles/", brand);
        brandProfileId = created.id;
        setProfiles((prev) => [created, ...prev]);
        setSelectedProfileId(created.id);
      } catch (err) {
        setValidationError(err instanceof Error ? err.message : "Failed to save profile");
        return;
      }
    }

    if (!brandProfileId) {
      if (!brand.brand_values.trim() || !brand.brand_mission.trim() || !brand.previous_messaging.trim()) {
        setValidationError("Fill in brand values, mission, and previous messaging.");
        return;
      }
    }

    await submit({
      campaign_draft: campaign.trim(),
      brand_profile_id: brandProfileId,
      brand_values: brandProfileId ? undefined : brand.brand_values.trim(),
      brand_mission: brandProfileId ? undefined : brand.brand_mission.trim(),
      previous_messaging: brandProfileId ? undefined : brand.previous_messaging.trim(),
    });
  }

  return (
    <div className="page analyze-page">
      <h1>New campaign analysis</h1>
      <p className="section-desc">
        Submit your draft and brand context. All five MVP checks run in one pass.
      </p>

      <form onSubmit={handleSubmit} className="analyze-form">
        <CampaignForm value={campaign} onChange={setCampaign} disabled={loading} />

        <fieldset className="brand-fieldset">
          <legend>Brand context</legend>
          <BrandProfileSelect
            profiles={profiles}
            selectedId={selectedProfileId}
            onSelect={setSelectedProfileId}
            disabled={loading}
          />

          {!useProfile && (
            <>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={saveProfile}
                  onChange={(e) => setSaveProfile(e.target.checked)}
                  disabled={loading}
                />
                Save as reusable brand profile
              </label>
              <BrandProfileForm values={brand} onChange={setBrand} disabled={loading} />
            </>
          )}

          {useProfile && (
            <p className="field-hint">
              Using saved profile. Select &quot;Use custom fields&quot; to enter context manually.
            </p>
          )}
        </fieldset>

        {(validationError || error) && (
          <p className="status error">{validationError || error}</p>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Running red-team analysis…" : "Run analysis"}
        </button>
      </form>
    </div>
  );
}
