import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form';
import { CourseCategory, type Course } from '@shared/types/api';
import { useSaveCourse } from '../hooks/use-save-course';
import { courseMetaSchema, COURSE_CATEGORY_LABELS, type CourseMetaFormValues } from '../schemas';

interface CourseMetaFormProps {
  courseId: string;
  course: Course | null;
}

export function CourseMetaForm({ courseId, course }: CourseMetaFormProps) {
  const saveCourse = useSaveCourse(courseId);
  const form = useForm<CourseMetaFormValues>({
    resolver: zodResolver(courseMetaSchema),
    values: {
      title: course?.title ?? '',
      description: course?.description ?? '',
      price: course?.price ?? 0,
      category: course?.category,
    },
  });

  function onSubmit(values: CourseMetaFormValues) {
    saveCourse.mutate(values);
  }

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground text-xl font-semibold tracking-tight">О курсе</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Цена, $</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      onChange={(event) => onChange(event.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CourseCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {COURSE_CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {saveCourse.isError && (
            <p className="text-destructive text-sm" role="alert">
              Не удалось сохранить курс. Попробуйте ещё раз.
            </p>
          )}
          {saveCourse.isSuccess && !saveCourse.isPending && (
            <p className="text-sm text-emerald-600" role="status">
              Сохранено.
            </p>
          )}
          <Button type="submit" disabled={saveCourse.isPending}>
            {saveCourse.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
