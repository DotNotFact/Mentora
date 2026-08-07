import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { cn } from '@shared/lib/utils';
import { reviewSchema, type ReviewFormValues } from '../schemas';

interface ReviewFormProps {
  courseId: string;
  initialValues?: ReviewFormValues;
  onSubmit: (values: ReviewFormValues) => void;
  isPending: boolean;
}

// Одна и та же Star-иконка для пустых/заполненных звёзд (fill-accent
// против fill-none), не два разных SVG — см. schedule/17 →
// "Дизайн-заметки". accent (амбер) — единственное расширение его
// назначения за пределы CTA/progress/badges, рейтинг семантически
// близок к "badge".
function StarPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Оценка">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} из 5`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="cursor-pointer rounded-sm transition-transform duration-150 hover:scale-110"
        >
          <Star
            className={cn(
              'text-accent size-6 transition-colors duration-150',
              star <= display ? 'fill-accent' : 'fill-none',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ initialValues, onSubmit, isPending }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialValues ?? { rating: 0, comment: '' },
  });
  const rating = form.watch('rating');

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border-border/60 bg-card space-y-3 rounded-xl border p-4"
    >
      <StarPicker
        value={rating}
        onChange={(value) => form.setValue('rating', value, { shouldValidate: true })}
      />
      {form.formState.errors.rating && (
        <p className="text-destructive text-xs" role="alert">
          {form.formState.errors.rating.message}
        </p>
      )}
      <Textarea
        placeholder="Что понравилось или не понравилось в курсе? (необязательно)"
        rows={3}
        {...form.register('comment')}
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {initialValues ? 'Сохранить изменения' : 'Опубликовать отзыв'}
      </Button>
    </form>
  );
}
