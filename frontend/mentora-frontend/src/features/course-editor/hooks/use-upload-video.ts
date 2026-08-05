import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosProgressEvent } from 'axios';
import { lessonsApi } from '@shared/api/client';
import type { Chapter } from '@shared/types/api';
import { courseEditorKeys } from './use-course-editor';

// Загружает видео урока (multipart, POST /lessons/{lessonId}/video) и
// отслеживает прогресс через axios onUploadProgress — используется
// video-upload.tsx для progress bar. Запрос не блокирует остальной UI:
// это обычная mutation, страница остаётся интерактивной во время загрузки.
export function useUploadVideo(courseId: string, lessonId: string) {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setProgress(0);
      return lessonsApi
        .uploadLessonVideo(
          lessonId,
          { file },
          {
            onUploadProgress: (event: AxiosProgressEvent) => {
              if (event.total) {
                setProgress(Math.round((event.loaded / event.total) * 100));
              }
            },
          },
        )
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      setProgress(100);
      queryClient.setQueryData<Chapter[]>(courseEditorKeys.chapters(courseId), (chapters) =>
        chapters?.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, videoUrl: data.videoUrl } : lesson,
          ),
        })),
      );
    },
  });

  return { ...mutation, progress };
}
