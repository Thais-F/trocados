import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <AuthCard
        title="Entrar"
        footer={
          <>
            Ainda não tem conta?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
              Cadastre-se
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
