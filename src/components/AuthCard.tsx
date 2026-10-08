import { WalletIcon } from "./icons";

export function AuthCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <WalletIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Meus Trocados
        </span>
      </div>

      <div className="flex w-full flex-col gap-6 rounded-2xl border border-border bg-surface/80 p-7 shadow-xl shadow-black/20 backdrop-blur">
        <h1 className="text-xl font-semibold">{title}</h1>
        {children}
      </div>

      <p className="text-sm text-muted">{footer}</p>
    </div>
  );
}
