import { auth, signOut } from "@/auth";
import { TransactionsPanel } from "@/components/TransactionsPanel";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-16">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">Olá, {session?.user?.name}</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            Sair
          </button>
        </form>
      </div>

      <TransactionsPanel />
    </div>
  );
}
