const FRIENDLY: Record<number, string> = {
  401: "API key rejected. Check your AI provider key in the server environment.",
  422: "The AI response could not be used. Try again or shorten your campaign draft.",
  502: "The AI service is temporarily unavailable. Please try again in a moment.",
  503: "AI is not configured correctly on the server. Contact the operator.",
};

export function formatApiError(status: number, detail: string): string {
  const trimmed = detail.trim();
  if (trimmed && trimmed !== "Internal Server Error" && trimmed.length < 280) {
    return trimmed;
  }
  return FRIENDLY[status] ?? `Request failed (${status}). Please try again.`;
}
