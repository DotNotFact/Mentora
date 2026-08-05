import { useMemo } from 'react';
import { sanitizeLessonHtml } from '@shared/lib/sanitize-html';

interface LessonContentProps {
  html: string;
}

// Рендерит rich-text содержимое урока (TipTap → contentHtml), созданное
// инструктором в course-editor. Единственный dangerouslySetInnerHTML в
// проекте — HTML пришёл от другого пользователя (инструктора), поэтому
// обязательно проходит через sanitizeLessonHtml (DOMPurify) перед
// рендером. Без плагина @tailwindcss/typography — базовые стили под
// теги TipTap заданы вручную через arbitrary variants.
export function LessonContent({ html }: LessonContentProps) {
  const safeHtml = useMemo(() => sanitizeLessonHtml(html), [html]);

  if (!safeHtml.trim()) {
    return null;
  }

  return (
    <div
      className="text-foreground space-y-3 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
