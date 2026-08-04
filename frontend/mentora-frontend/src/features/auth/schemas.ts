import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
