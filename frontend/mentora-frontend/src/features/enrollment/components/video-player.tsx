import { useEffect, useRef, type CSSProperties } from 'react';
import {
  MediaCommunitySkin,
  MediaOutlet,
  MediaPlayer,
  useMediaRemote,
  useMediaStore,
} from '@vidstack/react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { isLessonComplete } from '../lib/lesson-progress';

// Не чаще, чем раз в столько секунд просмотра, сохраняем позицию —
// иначе каждый tick timeupdate (несколько раз в секунду) бил бы по API.
const SAVE_INTERVAL_SECONDS = 10;

interface VideoPlayerProps {
  lessonId: string;
  src: string;
  title: string;
  initialPositionSeconds: number;
  completed: boolean;
  onProgress: (input: { positionSeconds: number; completed: boolean }) => void;
}

// --video-brand — единственная тема-переменная community-skin для
// акцентного цвета (заливка слайдера, активные пункты меню), см.
// vidstack/styles/community-skin/video.css. Остальной UI страницы
// (сайдбар, прогресс-бар) уже на токенах mentora-design — так весь экран
// выглядит согласованно, даже если хром самого плеера — дефолтный скин
// вендора, а не собственноручно собранный из примитивов.
const brandThemeStyle = { '--video-brand': 'var(--color-primary)' } as CSSProperties;

export function VideoPlayer({
  lessonId,
  src,
  title,
  initialPositionSeconds,
  completed,
  onProgress,
}: VideoPlayerProps) {
  return (
    <MediaPlayer
      src={src}
      title={title}
      className="aspect-video overflow-hidden rounded-xl bg-black"
      style={brandThemeStyle}
    >
      <MediaOutlet />
      <MediaCommunitySkin />
      <ProgressTracker
        key={lessonId}
        initialPositionSeconds={initialPositionSeconds}
        completed={completed}
        onProgress={onProgress}
      />
    </MediaPlayer>
  );
}

interface ProgressTrackerProps {
  initialPositionSeconds: number;
  completed: boolean;
  onProgress: (input: { positionSeconds: number; completed: boolean }) => void;
}

// Рендерится внутри <MediaPlayer>, поэтому useMediaStore/useMediaRemote
// находят ближайший плеер сами (через контекст) — без ref и связанных с
// ним проблем типизации кастомного элемента. `key={lessonId}` на
// родителе пересоздаёт этот компонент при смене урока, так что все
// внутренние ref-флаги ниже стартуют заново без отдельного эффекта-сброса.
function ProgressTracker({ initialPositionSeconds, completed, onProgress }: ProgressTrackerProps) {
  const { currentTime, duration, canPlay } = useMediaStore();
  const remote = useMediaRemote();

  const hasSeekedRef = useRef(false);
  const hasCompletedRef = useRef(completed);
  const lastSavedAtRef = useRef(0);

  // Восстановление позиции воспроизведения после обновления страницы —
  // ровно один раз, как только плеер готов к воспроизведению.
  useEffect(() => {
    if (canPlay && !hasSeekedRef.current && initialPositionSeconds > 0) {
      remote.seek(initialPositionSeconds);
      hasSeekedRef.current = true;
    }
  }, [canPlay, initialPositionSeconds, remote]);

  useEffect(() => {
    if (!duration || hasCompletedRef.current) {
      return;
    }

    if (isLessonComplete(currentTime, duration)) {
      hasCompletedRef.current = true;
      lastSavedAtRef.current = currentTime;
      onProgress({ positionSeconds: currentTime, completed: true });
      return;
    }

    if (currentTime - lastSavedAtRef.current >= SAVE_INTERVAL_SECONDS) {
      lastSavedAtRef.current = currentTime;
      onProgress({ positionSeconds: currentTime, completed: false });
    }
  }, [currentTime, duration, onProgress]);

  return null;
}
