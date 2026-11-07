export function LoadingSkeleton() {
  return (
    <div className="h-24 w-full animate-pulse rounded-2xl border border-border bg-surface" />
  );
}

export function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-danger/40 p-6 text-center">
      <p className="text-sm text-danger">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/90 transition hover:bg-surface-hover"
      >
        Tentar novamente
      </button>
    </div>
  );
}
