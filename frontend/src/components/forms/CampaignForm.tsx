interface CampaignFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onAutofill?: () => void;
}

export function CampaignForm({ value, onChange, disabled, onAutofill }: CampaignFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">Campaign draft</span>
        {onAutofill && (
          <button
            type="button"
            onClick={onAutofill}
            disabled={disabled}
            className="rounded-md border border-border bg-paper px-3 py-1.5 text-xs font-medium text-accent hover:border-accent disabled:opacity-50"
          >
            Load sample campaign
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={10}
        placeholder="Paste your full campaign copy: headlines, body, CTAs, disclaimers…"
        className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-muted"
      />
      <span className="text-xs text-muted">{value.length} characters (minimum 50)</span>
    </div>
  );
}
