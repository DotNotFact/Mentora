import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form';
import { useLogin } from '../hooks/use-login';
import { loginSchema, type LoginFormValues } from '../schemas';

export function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values);
  }

  return (
    <div className="bg-surface mx-auto max-w-md rounded-xl p-6 shadow-sm">
      <h1 className="text-foreground text-2xl leading-snug font-semibold tracking-tight">Вход</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {login.isError && (
            <p className="text-destructive text-sm" role="alert">
              Не удалось войти: проверьте email и пароль.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Войти
          </Button>
        </form>
      </Form>
    </div>
  );
}
