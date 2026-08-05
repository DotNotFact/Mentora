import { describe, expect, it } from 'vitest';
import { isLessonComplete } from '@features/enrollment/lib/lesson-progress';

describe('isLessonComplete', () => {
  it('is false before the 90% threshold', () => {
    expect(isLessonComplete(89, 100)).toBe(false);
  });

  it('is true exactly at the 90% threshold', () => {
    expect(isLessonComplete(90, 100)).toBe(true);
  });

  it('is true past the 90% threshold', () => {
    expect(isLessonComplete(95, 100)).toBe(true);
  });

  it('is false at the start of the video', () => {
    expect(isLessonComplete(0, 100)).toBe(false);
  });

  it('is false when duration is not known yet', () => {
    expect(isLessonComplete(10, 0)).toBe(false);
  });
});
