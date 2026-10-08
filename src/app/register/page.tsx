import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthCard } from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <AuthCard
        title="Criar conta"
        footer={
          <>
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Entrar
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
