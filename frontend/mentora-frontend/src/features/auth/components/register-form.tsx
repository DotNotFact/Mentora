import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form';
import { useRegister } from '../hooks/use-register';
import { registerSchema, type RegisterFormValues } from '../schemas';

export function RegisterForm() {
  const register = useRegister();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  function onSubmit(values: RegisterFormValues) {
    register.mutate(values);
  }

  return (
    <div className="bg-surface mx-auto max-w-md rounded-xl p-6 shadow-sm">
      <h1 className="text-foreground text-2xl leading-snug font-semibold tracking-tight">
        Регистрация
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input type="text" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {register.isError && (
            <p className="text-destructive text-sm" role="alert">
              Не удалось зарегистрироваться: возможно, email уже занят.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Зарегистрироваться
          </Button>
        </form>
      </Form>
    </div>
  );
}
