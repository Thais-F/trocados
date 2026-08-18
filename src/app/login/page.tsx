import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Entrar — Meus Trocados</h1>
      <LoginForm />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-medium underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
