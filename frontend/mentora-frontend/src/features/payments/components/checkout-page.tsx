import { Link } from '@tanstack/react-router';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Skeleton } from '@shared/ui/skeleton';
import { formatPrice } from '@shared/lib/utils';
import { useCourse } from '@features/courses/hooks/use-course';
import { useEnroll } from '@features/enrollment/hooks/use-enroll';
import { useCreateCheckout } from '../hooks/use-create-checkout';
import { useCheckoutStatus } from '../hooks/use-checkout-status';
import type { CheckoutReturnSearch } from '../schemas';

interface CheckoutPageProps {
  courseId: string;
  search: CheckoutReturnSearch;
}

// Тонкий диспетчер по статусу возврата со Stripe. Сама страница
// минималистична (см. schedule/05 → "Дизайн-заметки"): один CTA, без
// отвлекающих элементов — это касается и состояний ниже.
export function CheckoutPage({ courseId, search }: CheckoutPageProps) {
  if (search.status === 'cancel') {
    return <CheckoutCancelled courseId={courseId} />;
  }

  if (search.status === 'success' && search.session_id) {
    return <CheckoutStatusPoll courseId={courseId} sessionId={search.session_id} />;
  }

  return <CheckoutPrompt courseId={courseId} />;
}

function CheckoutPrompt({ courseId }: { courseId: string }) {
  const { data, isPending, isError } = useCourse(courseId);
  const createCheckout = useCreateCheckout();
  const enroll = useEnroll();

  if (isPending) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive py-12 text-center text-sm" role="alert">
        Не удалось загрузить курс. Попробуйте обновить страницу.
      </p>
    );
  }

  const course = data.data;
  const isFree = course.price === 0;

  function handlePay() {
    createCheckout.mutate(courseId, {
      onSuccess: ({ data }) => {
        window.location.assign(data.checkoutUrl);
      },
    });
  }

  function handleEnrollFree() {
    enroll.mutate(courseId);
  }

  const isRedirecting = createCheckout.isPending || createCheckout.isSuccess;

  if (enroll.isSuccess) {
    return <CheckoutSuccess courseId={courseId} />;
  }

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-xl leading-snug tracking-tight">{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground text-2xl leading-tight font-semibold tracking-tight tabular-nums md:text-3xl">
            {isFree ? 'Бесплатно' : formatPrice(course.price)}
          </p>

          {isFree ? (
            <Button
              type="button"
              className="w-full"
              disabled={enroll.isPending}
              onClick={handleEnrollFree}
            >
              {enroll.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              Записаться бесплатно
            </Button>
          ) : (
            <Button type="button" className="w-full" disabled={isRedirecting} onClick={handlePay}>
              {isRedirecting && <Loader2 className="animate-spin" aria-hidden="true" />}
              Оплатить
            </Button>
          )}

          {isRedirecting && (
            <p className="text-muted-foreground text-xs">Перенаправляем на страницу оплаты…</p>
          )}
          {(createCheckout.isError || enroll.isError) && (
            <p className="text-destructive text-xs" role="alert">
              Не удалось начать оплату. Попробуйте ещё раз.
            </p>
          )}
        </CardContent>
      </Card>
      <Link
        to="/courses/$courseId"
        params={{ courseId }}
        className="text-muted-foreground text-sm hover:underline"
      >
        Вернуться к курсу
      </Link>
    </div>
  );
}

function CheckoutStatusPoll({ courseId, sessionId }: { courseId: string; sessionId: string }) {
  const { data, isPending, isError } = useCheckoutStatus(sessionId);
  const status = data?.data.status;

  if (isPending) {
    return <CheckoutSpinner />;
  }

  if (isError || status === 'failed' || status === 'expired') {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <XCircle className="text-destructive mx-auto h-10 w-10" aria-hidden="true" />
        <p className="text-foreground text-sm font-medium">Оплата не прошла</p>
        <Button asChild variant="outline">
          <Link to="/checkout/$courseId" params={{ courseId }}>
            Попробовать снова
          </Link>
        </Button>
      </div>
    );
  }

  if (status === 'completed') {
    return <CheckoutSuccess courseId={courseId} />;
  }

  return <CheckoutSpinner />;
}

function CheckoutSpinner() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-12 text-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" aria-hidden="true" />
      <p className="text-muted-foreground text-sm">Проверяем оплату…</p>
    </div>
  );
}

function CheckoutSuccess({ courseId }: { courseId: string }) {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <CheckCircle2 className="text-success mx-auto h-10 w-10" aria-hidden="true" />
      <p className="text-foreground text-sm font-medium">Оплата прошла успешно</p>
      <Button asChild className="w-full">
        <Link to="/learning/$courseId" params={{ courseId }}>
          Начать обучение
        </Link>
      </Button>
    </div>
  );
}

function CheckoutCancelled({ courseId }: { courseId: string }) {
  // Возврат на страницу курса без записи — курс не оплачен и не
  // зачислен (критерий готовности schedule/05).
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <XCircle className="text-muted-foreground mx-auto h-10 w-10" aria-hidden="true" />
      <p className="text-foreground text-sm font-medium">Оплата отменена</p>
      <Button asChild variant="outline">
        <Link to="/courses/$courseId" params={{ courseId }}>
          Вернуться к курсу
        </Link>
      </Button>
    </div>
  );
}
