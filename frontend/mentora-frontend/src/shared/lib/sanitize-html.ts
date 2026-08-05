import DOMPurify from 'dompurify';

// Единственное место в проекте, где HTML из TipTap (lesson.contentHtml)
// разрешено рендерить через dangerouslySetInnerHTML — см. schedule/09,
// "Security-гигиена". Инструктор может внедрить произвольный HTML через
// редактор курса; без санитизации это прямой XSS для каждого студента,
// открывшего урок.
export function sanitizeLessonHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
