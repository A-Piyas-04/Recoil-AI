interface CampaignFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CampaignForm({ value, onChange, disabled }: CampaignFormProps) {
  return (
    <label>
      Campaign draft
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={10}
        placeholder="Paste your full campaign copy: headlines, body, CTAs, disclaimers…"
      />
      <span className="field-hint">{value.length} characters (minimum 50)</span>
    </label>
  );
}
