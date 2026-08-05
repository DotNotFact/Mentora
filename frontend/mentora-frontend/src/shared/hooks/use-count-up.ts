import { useEffect, useRef, useState } from 'react';
import { useMedia } from './use-media';

/**
 * Анимированно считает от предыдущего к новому числовому значению вместо
 * мгновенной замены — см. .agents/skills/aaa-ui-polish/SKILL.md,
 * "Числа считают, а не появляются". Пропускается при
 * prefers-reduced-motion — целевое значение применяется сразу.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const prefersReducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  const [value, setValue] = useState(() => (prefersReducedMotion ? target : 0));
  const fromRef = useRef(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (fromRef.current !== target) {
        fromRef.current = target;
        setValue(target);
      }
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    let frame: number;

    function tick() {
      // performance.now() внутри тика, а не аргумент-таймстемп callback'а —
      // в некоторых окружениях (jsdom/тесты) этот аргумент не гарантированно
      // синхронизирован с performance.now(), из-за чего (now - start) может
      // уйти в отрицательные числа — без клампа это отправляет
      // экспоненциальный eased-расчёт в астрономические значения.
      const now = performance.now();
      const progress = Math.min(Math.max((now - start) / durationMs, 0), 1);
      // --ease-out-expo эквивалент (см. globals.css)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(from + (target - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, prefersReducedMotion]);

  return value;
}
