export interface BrandProfileFormValues {
  name: string;
  brand_values: string;
  brand_mission: string;
  previous_messaging: string;
}

interface BrandProfileFormProps {
  values: BrandProfileFormValues;
  onChange: (values: BrandProfileFormValues) => void;
  disabled?: boolean;
}

export function BrandProfileForm({ values, onChange, disabled }: BrandProfileFormProps) {
  function update<K extends keyof BrandProfileFormValues>(key: K, value: BrandProfileFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink">Profile name</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={disabled}
          className="mt-1 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink">Brand values</span>
        <textarea
          value={values.brand_values}
          onChange={(e) => update("brand_values", e.target.value)}
          disabled={disabled}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink">Brand mission</span>
        <textarea
          value={values.brand_mission}
          onChange={(e) => update("brand_mission", e.target.value)}
          disabled={disabled}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink">Previous messaging</span>
        <textarea
          value={values.previous_messaging}
          onChange={(e) => update("previous_messaging", e.target.value)}
          disabled={disabled}
          rows={4}
          className="mt-1 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
