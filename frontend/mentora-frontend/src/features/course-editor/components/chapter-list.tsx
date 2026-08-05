import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { cn } from '@shared/lib/utils';
import type { Chapter, Lesson } from '@shared/types/api';
import { useCourseEditorStore } from '../store';
import { useReorderChapters } from '../hooks/use-reorder-chapters';

interface ChapterListProps {
  courseId: string;
  chapters: Chapter[];
}

// Редактор дерева глав/уроков курса. Единственный бэкенд-эндпоинт для
// структуры — PUT /courses/{courseId}/chapters (полный upsert дерева), так
// что и reorder, и add/delete главы/урока идут через один и тот же
// useReorderChapters — он не только "переставляет", а сохраняет весь
// актуальный массив (см. деталь в openapi.yaml → saveChapters).
export function ChapterList({ courseId, chapters }: ChapterListProps) {
  const reorderChapters = useReorderChapters(courseId);
  const selectedLessonId = useCourseEditorStore((state) => state.selectedLessonId);
  const selectLesson = useCourseEditorStore((state) => state.selectLesson);
  const expandedChapterIds = useCourseEditorStore((state) => state.expandedChapterIds);
  const toggleChapterExpanded = useCourseEditorStore((state) => state.toggleChapterExpanded);
  const expandChapter = useCourseEditorStore((state) => state.expandChapter);
  const activeDragId = useCourseEditorStore((state) => state.activeDragId);
  const setActiveDragId = useCourseEditorStore((state) => state.setActiveDragId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function persist(nextChapters: Chapter[]) {
    reorderChapters.mutate(nextChapters);
  }

  function handleChapterDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = chapters.findIndex((chapter) => chapter.id === active.id);
    const newIndex = chapters.findIndex((chapter) => chapter.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(chapters, oldIndex, newIndex).map((chapter, index) => ({
      ...chapter,
      order: index,
    }));
    persist(reordered);
  }

  function handleLessonReorder(chapterId: string, reorderedLessons: Lesson[]) {
    persist(
      chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, lessons: reorderedLessons } : chapter,
      ),
    );
  }

  function handleRenameChapter(chapterId: string, title: string) {
    const trimmed = title.trim();
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter || !trimmed || chapter.title === trimmed) return;
    persist(chapters.map((c) => (c.id === chapterId ? { ...c, title: trimmed } : c)));
  }

  function handleRenameLesson(chapterId: string, lessonId: string, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    persist(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, title: trimmed } : lesson,
              ),
            }
          : chapter,
      ),
    );
  }

  function handleAddChapter() {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      courseId,
      title: 'Новая глава',
      order: chapters.length,
      lessons: [],
    };
    expandChapter(newChapter.id);
    persist([...chapters, newChapter]);
  }

  function handleDeleteChapter(chapter: Chapter) {
    if (chapter.lessons.some((lesson) => lesson.id === selectedLessonId)) {
      selectLesson(null);
    }
    persist(
      chapters.filter((c) => c.id !== chapter.id).map((c, index) => ({ ...c, order: index })),
    );
  }

  function handleAddLesson(chapter: Chapter) {
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      chapterId: chapter.id,
      title: 'Новый урок',
      order: chapter.lessons.length,
      contentHtml: '',
      videoUrl: null,
    };
    expandChapter(chapter.id);
    handleLessonReorder(chapter.id, [...chapter.lessons, newLesson]);
    selectLesson(newLesson.id);
  }

  function handleDeleteLesson(chapter: Chapter, lesson: Lesson) {
    if (selectedLessonId === lesson.id) {
      selectLesson(null);
    }
    handleLessonReorder(
      chapter.id,
      chapter.lessons.filter((l) => l.id !== lesson.id).map((l, index) => ({ ...l, order: index })),
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-semibold tracking-tight">Главы курса</h2>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddChapter}>
          <Plus aria-hidden="true" />
          Глава
        </Button>
      </div>

      {chapters.length === 0 ? (
        <p className="text-muted-foreground text-sm">Пока нет глав — добавьте первую.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveDragId(String(event.active.id))}
          onDragEnd={handleChapterDragEnd}
          onDragCancel={() => setActiveDragId(null)}
        >
          <SortableContext
            items={chapters.map((chapter) => chapter.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2" aria-label="Список глав">
              {chapters.map((chapter) => (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  isActiveDrag={activeDragId === chapter.id}
                  isExpanded={expandedChapterIds.has(chapter.id)}
                  selectedLessonId={selectedLessonId}
                  activeDragId={activeDragId}
                  onToggleExpand={() => toggleChapterExpanded(chapter.id)}
                  onSelectLesson={selectLesson}
                  onDelete={() => handleDeleteChapter(chapter)}
                  onRename={(title) => handleRenameChapter(chapter.id, title)}
                  onAddLesson={() => handleAddLesson(chapter)}
                  onDeleteLesson={(lesson) => handleDeleteLesson(chapter, lesson)}
                  onRenameLesson={(lessonId, title) =>
                    handleRenameLesson(chapter.id, lessonId, title)
                  }
                  onReorderLessons={(lessons) => handleLessonReorder(chapter.id, lessons)}
                  onDragStart={(id) => setActiveDragId(id)}
                  onDragCancel={() => setActiveDragId(null)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

interface ChapterItemProps {
  chapter: Chapter;
  isActiveDrag: boolean;
  isExpanded: boolean;
  selectedLessonId: string | null;
  activeDragId: string | null;
  onToggleExpand: () => void;
  onSelectLesson: (lessonId: string) => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onAddLesson: () => void;
  onDeleteLesson: (lesson: Lesson) => void;
  onRenameLesson: (lessonId: string, title: string) => void;
  onReorderLessons: (lessons: Lesson[]) => void;
  onDragStart: (id: string) => void;
  onDragCancel: () => void;
}

function ChapterItem({
  chapter,
  isActiveDrag,
  isExpanded,
  selectedLessonId,
  activeDragId,
  onToggleExpand,
  onSelectLesson,
  onDelete,
  onRename,
  onAddLesson,
  onDeleteLesson,
  onRenameLesson,
  onReorderLessons,
  onDragStart,
  onDragCancel,
}: ChapterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: chapter.id,
  });

  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleLessonDragEnd(event: DragEndEvent) {
    onDragCancel();
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = chapter.lessons.findIndex((lesson) => lesson.id === active.id);
    const newIndex = chapter.lessons.findIndex((lesson) => lesson.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(chapter.lessons, oldIndex, newIndex).map((lesson, index) => ({
      ...lesson,
      order: index,
    }));
    onReorderLessons(reordered);
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition: transition ?? undefined }}
      className={cn('bg-card rounded-lg border', isActiveDrag && 'shadow-lg')}
    >
      <div className="flex items-center gap-1 p-2">
        <button
          type="button"
          className="text-muted-foreground hover:bg-secondary cursor-grab touch-none rounded p-1 active:cursor-grabbing"
          aria-label={`Перетащить главу «${chapter.title}»`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Свернуть главу' : 'Развернуть главу'}
          className="text-muted-foreground hover:bg-secondary rounded p-1"
        >
          {isExpanded ? (
            <ChevronDown className="size-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-4" aria-hidden="true" />
          )}
        </button>
        <input
          defaultValue={chapter.title}
          onBlur={(event) => onRename(event.target.value)}
          aria-label="Название главы"
          className="focus-visible:ring-ring min-w-0 flex-1 rounded bg-transparent px-1 py-0.5 text-sm font-medium focus-visible:ring-1 focus-visible:outline-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-7"
          aria-label={`Удалить главу «${chapter.title}»`}
          onClick={onDelete}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-1 border-t px-2 pt-2 pb-2">
          {chapter.lessons.length === 0 ? (
            <p className="text-muted-foreground px-2 py-1 text-xs">Нет уроков.</p>
          ) : (
            <DndContext
              sensors={lessonSensors}
              collisionDetection={closestCenter}
              onDragStart={(event) => onDragStart(String(event.active.id))}
              onDragEnd={handleLessonDragEnd}
              onDragCancel={onDragCancel}
            >
              <SortableContext
                items={chapter.lessons.map((lesson) => lesson.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-1" aria-label={`Уроки главы «${chapter.title}»`}>
                  {chapter.lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      isSelected={selectedLessonId === lesson.id}
                      isActiveDrag={activeDragId === lesson.id}
                      onSelect={() => onSelectLesson(lesson.id)}
                      onDelete={() => onDeleteLesson(lesson)}
                      onRename={(title) => onRenameLesson(lesson.id, title)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
          <Button type="button" variant="ghost" size="sm" className="mt-1" onClick={onAddLesson}>
            <Plus aria-hidden="true" />
            Урок
          </Button>
        </div>
      )}
    </li>
  );
}

interface LessonRowProps {
  lesson: Lesson;
  isSelected: boolean;
  isActiveDrag: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

function LessonRow({
  lesson,
  isSelected,
  isActiveDrag,
  onSelect,
  onDelete,
  onRename,
}: LessonRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition: transition ?? undefined }}
      className={cn(
        'flex items-center gap-1 rounded-md pr-1 pl-1',
        isSelected && 'bg-primary/10',
        isActiveDrag && 'shadow-lg',
      )}
    >
      <button
        type="button"
        className="text-muted-foreground hover:bg-secondary cursor-grab touch-none rounded p-1 active:cursor-grabbing"
        aria-label={`Перетащить урок «${lesson.title}»`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" aria-hidden="true" />
      </button>
      {/* Фокус на поле = выбор урока (его контент открывается в LessonEditor справа),
          blur с изменённым значением = переименование — одно действие вместо двух виджетов. */}
      <input
        key={lesson.id}
        defaultValue={lesson.title}
        onFocus={onSelect}
        onBlur={(event) => onRename(event.target.value)}
        aria-label={`Название урока «${lesson.title}»`}
        aria-current={isSelected ? 'true' : undefined}
        className={cn(
          'hover:bg-secondary focus-visible:ring-ring min-w-0 flex-1 truncate rounded bg-transparent px-1 py-1 text-left text-sm focus-visible:ring-1 focus-visible:outline-none',
          isSelected && 'font-medium',
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-6"
        aria-label={`Удалить урок «${lesson.title}»`}
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </Button>
    </li>
  );
}
