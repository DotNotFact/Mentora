import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageCircle } from 'lucide-react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import { Textarea } from '@shared/ui/textarea';
import { cn, formatDate } from '@shared/lib/utils';
import { useAuthStore } from '@features/auth/store';
import { useCourse } from '@features/courses/hooks/use-course';
import type { Comment } from '@shared/types/api';
import { useEnrollmentStatus } from '../hooks/use-enrollment-status';
import { useLessonComments } from '../hooks/use-lesson-comments';
import { useCreateLessonComment } from '../hooks/use-create-lesson-comment';
import { commentSchema, type CommentFormValues } from '../schemas';

const PAGE_SIZE = 10;

interface CommentFormProps {
  placeholder: string;
  submitLabel: string;
  isPending: boolean;
  isError?: boolean;
  autoFocus?: boolean;
  rows?: number;
  onSubmit: (values: CommentFormValues) => Promise<unknown>;
  onCancel?: () => void;
}

function CommentForm({
  placeholder,
  submitLabel,
  isPending,
  isError,
  autoFocus,
  rows = 3,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: '' },
  });

  async function submit(values: CommentFormValues) {
    try {
      await onSubmit(values);
      form.reset();
    } catch {
      // Ошибка уже отражена в isError мутации — форма не очищается, чтобы
      // пользователь не потерял набранный текст.
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-2">
      <Textarea
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        {...form.register('body')}
      />
      {form.formState.errors.body && (
        <p className="text-destructive text-xs" role="alert">
          {form.formState.errors.body.message}
        </p>
      )}
      {isError && (
        <p className="text-destructive text-xs" role="alert">
          Не удалось отправить сообщение. Попробуйте ещё раз.
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  isCourseInstructor,
}: {
  comment: Comment;
  isCourseInstructor: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-foreground text-sm font-medium">{comment.userName}</span>
        {isCourseInstructor && <Badge variant="secondary">Автор курса</Badge>}
        <span className="text-muted-foreground text-xs">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{comment.body}</p>
    </div>
  );
}

// Ответ на конкретный корневой комментарий — собственный вызов
// use-create-lesson-comment (не общий с формой вопроса), чтобы pending/
// error-состояние и закрытие по успеху не мешали другим открытым формам
// ответа в этом же треде.
function ReplyForm({
  lessonId,
  parentId,
  onDone,
}: {
  lessonId: string;
  parentId: string;
  onDone: () => void;
}) {
  const createReply = useCreateLessonComment(lessonId);

  return (
    <CommentForm
      placeholder="Ваш ответ..."
      submitLabel="Ответить"
      isPending={createReply.isPending}
      isError={createReply.isError}
      autoFocus
      rows={2}
      onCancel={onDone}
      onSubmit={async (values) => {
        await createReply.mutateAsync({ body: values.body, parentId });
        onDone();
      }}
    />
  );
}

function CommentThread({
  lessonId,
  comments,
  instructorId,
  canWrite,
}: {
  lessonId: string;
  comments: Comment[];
  instructorId: string | undefined;
  canWrite: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const roots = useMemo(
    () =>
      comments
        .filter((comment) => !comment.parentId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [comments],
  );
  const repliesByParent = useMemo(() => {
    const map = new Map<string, Comment[]>();
    for (const comment of comments) {
      if (!comment.parentId) continue;
      const list = map.get(comment.parentId) ?? [];
      list.push(comment);
      map.set(comment.parentId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return map;
  }, [comments]);

  if (roots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <span className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <MessageCircle className="text-muted-foreground h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">Пока нет вопросов</p>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Задайте первый вопрос по этому уроку.
          </p>
        </div>
      </div>
    );
  }

  const visibleRoots = roots.slice(0, visibleCount);

  return (
    <div className="space-y-5">
      {visibleRoots.map((root) => {
        const replies = repliesByParent.get(root.id) ?? [];
        return (
          <div key={root.id} className="border-border/60 space-y-3 border-b pb-5 last:border-0">
            <CommentItem
              comment={root}
              isCourseInstructor={root.userRole === 'instructor' && root.userId === instructorId}
            />
            {replies.length > 0 && (
              <div className="border-border/60 ml-6 space-y-3 border-l pl-4">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isCourseInstructor={
                      reply.userRole === 'instructor' && reply.userId === instructorId
                    }
                  />
                ))}
              </div>
            )}
            {canWrite &&
              (replyingToId === root.id ? (
                <div className="ml-6">
                  <ReplyForm
                    lessonId={lessonId}
                    parentId={root.id}
                    onDone={() => setReplyingToId(null)}
                  />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-6"
                  onClick={() => setReplyingToId(root.id)}
                >
                  Ответить
                </Button>
              ))}
          </div>
        );
      })}
      {visibleCount < roots.length && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Показать ещё
        </Button>
      )}
    </div>
  );
}

interface LessonDiscussionProps {
  lessonId: string;
  courseId: string;
  className?: string;
}

// Секция обсуждения/Q&A под уроком (schedule/19) — плоский список с одним
// уровнем вложенности, без real-time (refetch по действию/повторному
// заходу). Писать могут записанные на курс пользователи и инструктор
// курса; читать может кто угодно, у кого открыт плеер обучения (доступ к
// самому роуту learning/$courseId уже гейтится записью на курс выше по
// дереву — см. LearningPage).
export function LessonDiscussion({ lessonId, courseId, className }: LessonDiscussionProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEnrolled } = useEnrollmentStatus(isAuthenticated ? courseId : '');
  const { data: courseData } = useCourse(courseId);
  const commentsQuery = useLessonComments(lessonId);
  const createComment = useCreateLessonComment(lessonId);

  const instructorId = courseData?.data.instructorId;
  const isCourseInstructor = Boolean(user && instructorId && user.id === instructorId);
  const canWrite = isEnrolled || isCourseInstructor;

  return (
    <div className={cn('border-border/60 space-y-4 border-t pt-6', className)}>
      <h2 className="text-foreground text-2xl leading-snug font-semibold tracking-tight">
        Обсуждение
      </h2>
      {canWrite && (
        <CommentForm
          placeholder="Задайте вопрос по этому уроку..."
          submitLabel="Отправить"
          isPending={createComment.isPending}
          isError={createComment.isError}
          onSubmit={(values) => createComment.mutateAsync({ body: values.body })}
        />
      )}
      {commentsQuery.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : commentsQuery.isError ? (
        <p className="text-destructive py-6 text-center text-sm" role="alert">
          Не удалось загрузить обсуждение. Попробуйте обновить страницу.
        </p>
      ) : (
        <CommentThread
          lessonId={lessonId}
          comments={commentsQuery.data.data}
          instructorId={instructorId}
          canWrite={canWrite}
        />
      )}
    </div>
  );
}
