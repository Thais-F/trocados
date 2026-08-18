import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Criar conta — Meus Trocados</h1>
      <RegisterForm />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
