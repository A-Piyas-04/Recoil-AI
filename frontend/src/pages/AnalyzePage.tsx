import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { SAMPLE_BRAND, SAMPLE_CAMPAIGN } from "../lib/sampleCampaign";
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

  function loadSample() {
    setCampaign(SAMPLE_CAMPAIGN);
    if (!useProfile) {
      setBrand(SAMPLE_BRAND);
    }
    setValidationError(null);
  }

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
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">New campaign analysis</h1>
      <p className="mt-2 text-muted">
        Submit your draft and brand context. All five checks run in one pass.
      </p>

      {loading && (
        <div
          className="mt-6 rounded-lg border border-border bg-paper px-4 py-3 text-sm text-ink"
          role="status"
          aria-live="polite"
        >
          Running red-team analysis… This usually takes 15–45 seconds.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <CampaignForm
          value={campaign}
          onChange={setCampaign}
          disabled={loading}
          onAutofill={loadSample}
        />

        <fieldset className="space-y-4 rounded-lg border border-border bg-paper p-5">
          <legend className="px-1 text-sm font-semibold text-ink">Brand context</legend>
          <BrandProfileSelect
            profiles={profiles}
            selectedId={selectedProfileId}
            onSelect={setSelectedProfileId}
            disabled={loading}
          />

          {!useProfile && (
            <>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={saveProfile}
                  onChange={(e) => setSaveProfile(e.target.checked)}
                  disabled={loading}
                  className="rounded border-border"
                />
                Save as reusable brand profile
              </label>
              <BrandProfileForm values={brand} onChange={setBrand} disabled={loading} />
            </>
          )}

          {useProfile && (
            <p className="text-sm text-muted">
              Using saved profile. Select &quot;Use custom fields&quot; to enter context manually.
            </p>
          )}
        </fieldset>

        {(validationError || error) && (
          <p className="rounded-md border border-risk-high/30 bg-risk-high/5 px-4 py-3 text-sm text-risk-high">
            {validationError || error}
          </p>
        )}

        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Analyzing…" : "Run analysis"}
        </button>
      </form>
    </div>
  );
}
