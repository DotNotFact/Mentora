import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollTo; TanStack Router calls it for scroll restoration.
window.scrollTo = () => {};

// jsdom does not implement matchMedia; useMedia() (prefers-reduced-motion
// checks, useCountUp, будущие responsive-хуки) вызывает его напрямую.
// Дефолт matches:false — тесты не подразумевают reduced-motion/конкретный
// viewport, если явно не замокано в самом тесте.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
