import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { AnalyzeRequest, AnalyzeResponse } from "../types/analysis";

export function useAnalysis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: AnalyzeRequest) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.post<AnalyzeResponse>("/api/v1/analyze", payload);
        navigate(`/results/${data.analysis_id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return { submit, loading, error };
}
