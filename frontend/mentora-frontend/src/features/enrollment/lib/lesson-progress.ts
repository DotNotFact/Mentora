// Урок считается пройденным при пересечении этой доли длительности
// видео — см. schedule/04, "Критерии готовности".
export const COMPLETE_THRESHOLD = 0.9;

export function isLessonComplete(currentTime: number, duration: number): boolean {
  if (duration <= 0) {
    return false;
  }
  return currentTime / duration >= COMPLETE_THRESHOLD;
}
