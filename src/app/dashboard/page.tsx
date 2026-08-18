import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Bem-vindo, {session?.user?.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Este é o painel protegido. Conteúdo real (transações, categorias,
        metas) chega nas próximas entregas.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          Sair
        </button>
      </form>
    </div>
  );
}
