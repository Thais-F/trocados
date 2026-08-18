import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
