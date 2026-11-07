import { z } from "zod";
import { CATEGORY_COLORS } from "./colors";

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

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria obrigatória"),
  description: z.string().trim().max(280).optional().or(z.literal("")),
  date: z.coerce.date(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(50),
  color: z.enum(CATEGORY_COLORS, "Cor inválida"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
