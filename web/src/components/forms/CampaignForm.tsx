"use client";

import type { CampaignInput } from "@/types/analysis";

export const EMPTY_CAMPAIGN: CampaignInput = {
  campaign_name: "",
  slogan: "",
  campaign_description: "",
  campaign_copy: "",
};

interface CampaignFormProps {
  value: CampaignInput;
  onChange: (value: CampaignInput) => void;
  disabled?: boolean;
}

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition-colors placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-400";

export function CampaignForm({ value, onChange, disabled }: CampaignFormProps) {
  const set =
    (key: keyof CampaignInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...value, [key]: e.target.value });
    };

  const copyLength =
    value.campaign_description.length + value.campaign_copy.length;

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-stone-700">
        Campaign name
        <input
          type="text"
          className={fieldClass}
          value={value.campaign_name}
          onChange={set("campaign_name")}
          disabled={disabled}
          placeholder="e.g. Spring Sustainability Push"
          required
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Slogan
        <input
          type="text"
          className={fieldClass}
          value={value.slogan}
          onChange={set("slogan")}
          disabled={disabled}
          placeholder="Primary tagline or hook"
          required
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Campaign description
        <textarea
          className={`${fieldClass} min-h-[100px] resize-y`}
          value={value.campaign_description}
          onChange={set("campaign_description")}
          disabled={disabled}
          rows={4}
          placeholder="Objectives, audience, channels, and context for reviewers"
          required
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Campaign copy
        <textarea
          className={`${fieldClass} min-h-[180px] resize-y font-mono text-sm`}
          value={value.campaign_copy}
          onChange={set("campaign_copy")}
          disabled={disabled}
          rows={10}
          placeholder="Headlines, body copy, CTAs, disclaimers — paste the full draft"
          required
        />
        <span className="mt-1 block text-xs text-stone-500">
          {copyLength} characters in description + copy (minimum 30 combined)
        </span>
      </label>
    </div>
  );
}
