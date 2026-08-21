export default function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-400">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
        {label}
      </div>
    </div>
  );
}
