import Link from "next/link";
import { signOut } from "@/auth";
import { LogoutIcon, WalletIcon } from "./icons";

export function AppHeader({
  userName,
  active,
}: {
  userName?: string | null;
  active: "dashboard" | "categories";
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <WalletIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Bem-vinda de volta</p>
            <h1 className="font-semibold leading-tight">{userName}</h1>
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
      </div>

      <nav className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1">
        <Link
          href="/dashboard"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === "dashboard"
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          Transações
        </Link>
        <Link
          href="/categories"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === "categories"
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          Categorias
        </Link>
      </nav>
    </header>
  );
}
