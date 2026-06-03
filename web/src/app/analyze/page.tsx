import { Header } from "@/components/layout/Header";
import { AnalyzeClient } from "@/app/analyze/AnalyzeClient";

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-6 py-12">
        <AnalyzeClient />
      </main>
    </>
  );
}
