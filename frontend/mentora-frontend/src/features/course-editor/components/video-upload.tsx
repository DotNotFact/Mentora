import { useRef, useState, type ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Progress } from '@shared/ui/progress';
import type { Lesson } from '@shared/types/api';
import { useUploadVideo } from '../hooks/use-upload-video';

interface VideoUploadProps {
  courseId: string;
  lesson: Lesson;
}

// Загрузка видео урока: multipart POST /lessons/{lessonId}/video с
// прогресс-баром (axios onUploadProgress через use-upload-video). Это
// обычная TanStack Query mutation — страница остаётся интерактивной, пока
// файл грузится (не блокирует остальной UI).
export function VideoUpload({ courseId, lesson }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadVideo = useUploadVideo(courseId, lesson.id);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setLocalPreviewUrl(URL.createObjectURL(file));
    uploadVideo.mutate(file);
  }

  const currentVideoUrl = uploadVideo.data?.videoUrl ?? lesson.videoUrl;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploadVideo.isPending}
        >
          <UploadCloud aria-hidden="true" />
          {currentVideoUrl ? 'Заменить видео' : 'Загрузить видео'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Видео урока"
        />
      </div>

      {uploadVideo.isPending && (
        <div className="space-y-1" role="status">
          <Progress value={uploadVideo.progress} aria-label="Прогресс загрузки видео" />
          <p className="text-muted-foreground text-xs">{uploadVideo.progress}%</p>
        </div>
      )}

      {uploadVideo.isError && (
        <p className="text-destructive text-sm" role="alert">
          Не удалось загрузить видео. Попробуйте ещё раз.
        </p>
      )}

      {currentVideoUrl && !uploadVideo.isPending && (
        <video
          src={localPreviewUrl ?? currentVideoUrl}
          controls
          className="aspect-video w-full rounded-lg bg-black"
        />
      )}
    </div>
  );
}
