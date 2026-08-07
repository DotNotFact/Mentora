import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn, formatDate } from '@shared/lib/utils';
import { Button } from '@shared/ui/button';
import type { Review } from '@shared/types/api';

const PAGE_SIZE = 10;

function StaticStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn('text-accent size-3.5', star <= rating ? 'fill-accent' : 'fill-none')}
        />
      ))}
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Пока нет отзывов — станьте первым, кто оставит оценку.
      </p>
    );
  }

  const visible = reviews.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visible.map((review) => (
        <div key={review.id} className="border-border/60 space-y-1 border-b pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">{review.userName}</span>
            <span className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</span>
          </div>
          <StaticStars rating={review.rating} />
          {review.comment && (
            <p className="text-foreground text-sm leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
      {visibleCount < reviews.length && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Показать ещё
        </Button>
      )}
    </div>
  );
}
