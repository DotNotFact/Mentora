import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollTo; TanStack Router calls it for scroll restoration.
window.scrollTo = () => {};
