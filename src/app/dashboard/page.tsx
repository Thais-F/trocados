import { auth, signOut } from "@/auth";
import { TransactionsPanel } from "@/components/TransactionsPanel";
import { LogoutIcon, WalletIcon } from "@/components/icons";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <WalletIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted">Bem-vinda de volta</p>
              <h1 className="font-semibold leading-tight">{session?.user?.name}</h1>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground/90 transition hover:bg-surface-hover"
            >
              <LogoutIcon className="h-4 w-4" />
              Sair
            </button>
          </form>
        </header>

        <TransactionsPanel />
      </div>
    </div>
  );
}
