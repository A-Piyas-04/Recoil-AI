export function riskLevel(score: number): "low" | "moderate" | "high" {
  if (score < 40) return "low";
  if (score < 70) return "moderate";
  return "high";
}

export function riskBarClass(score: number): string {
  const level = riskLevel(score);
  if (level === "low") return "bg-emerald-600";
  if (level === "moderate") return "bg-amber-600";
  return "bg-red-700";
}

export function riskTextClass(score: number): string {
  const level = riskLevel(score);
  if (level === "low") return "text-emerald-800";
  if (level === "moderate") return "text-amber-800";
  return "text-red-800";
}
