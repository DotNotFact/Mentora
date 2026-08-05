import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { cn } from '@shared/lib/utils';
import type { Lesson } from '@shared/types/api';
import { useSaveLessonContent } from '../hooks/use-save-lesson-content';

interface LessonEditorProps {
  courseId: string;
  lesson: Lesson;
}

// Rich-text редактор содержимого урока. contentHtml сериализуется через
// editor.getHTML() и сохраняется PUT /lessons/{lessonId}/content — см.
// openapi.yaml (сознательно HTML-строка, а не JSON ProseMirror-документ,
// чтобы бэкенду не нужно было тянуть ProseMirror-схему для рендера/поиска).
export function LessonEditor({ courseId, lesson }: LessonEditorProps) {
  const saveContent = useSaveLessonContent(courseId, lesson.id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Начните писать содержимое урока…' }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Color,
      TextStyle,
    ],
    content: lesson.contentHtml,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus-visible:outline-none',
      },
    },
  });

  // Выбрали другой урок в ChapterList — подгружаем его сохранённый HTML.
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(lesson.contentHtml, { emitUpdate: false });
    // Намеренно только по смене урока: contentHtml из query-кэша не должен
    // перетирать то, что инструктор ещё не сохранил.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, lesson.id]);

  function handleSave() {
    if (!editor) return;
    saveContent.mutate(editor.getHTML());
  }

  function handleSetLink() {
    if (!editor) return;
    const previousUrl = (editor.getAttributes('link').href as string | undefined) ?? '';
    const url = window.prompt('Ссылка (URL):', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  function handleAddImage() {
    if (!editor) return;
    const url = window.prompt('URL изображения:');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-xl border shadow-sm">
      <div className="bg-card sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-xl border-b p-2">
        <ToolbarButton
          label="Полужирный"
          icon={Bold}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Курсив"
          icon={Italic}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Подчёркнутый"
          icon={UnderlineIcon}
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Зачёркнутый"
          icon={Strikethrough}
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          label="Выделение"
          icon={Highlighter}
          isActive={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          label="Список"
          icon={List}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Нумерованный список"
          icon={ListOrdered}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          label="По левому краю"
          icon={AlignLeft}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <ToolbarButton
          label="По центру"
          icon={AlignCenter}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <ToolbarButton
          label="По правому краю"
          icon={AlignRight}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          label="Ссылка"
          icon={LinkIcon}
          isActive={editor.isActive('link')}
          onClick={handleSetLink}
        />
        <ToolbarButton label="Изображение" icon={ImageIcon} onClick={handleAddImage} />
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={saveContent.isPending}
          className="ml-auto"
        >
          {saveContent.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          Сохранить
        </Button>
      </div>
      <EditorContent editor={editor} />
      {saveContent.isError && (
        <p className="text-destructive px-4 pb-3 text-sm" role="alert">
          Не удалось сохранить содержимое урока.
        </p>
      )}
    </div>
  );
}

interface ToolbarButtonProps {
  label: string;
  icon: typeof Bold;
  isActive?: boolean;
  onClick: () => void;
}

function ToolbarButton({ label, icon: Icon, isActive = false, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn('size-8', isActive && 'bg-accent text-accent-foreground')}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
