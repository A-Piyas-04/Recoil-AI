import type { BrandProfile } from "../../types/analysis";

interface BrandProfileSelectProps {
  profiles: BrandProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function BrandProfileSelect({
  profiles,
  selectedId,
  onSelect,
  disabled,
}: BrandProfileSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">Saved brand profile</span>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
      >
        <option value="">Use custom fields</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
    </label>
  );
}
