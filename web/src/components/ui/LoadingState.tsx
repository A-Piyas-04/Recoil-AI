export function LoadingState() {
  return (
    <div
      className="rounded-sm border border-stone-200 bg-white p-10 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
      <p className="mt-6 font-serif text-lg font-medium text-stone-900">
        Running red-team analysis
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
        Generating adversarial perspectives, meme simulations, risk scores, and a
        crisis scenario. This usually takes 15–45 seconds.
      </p>
    </div>
  );
}
