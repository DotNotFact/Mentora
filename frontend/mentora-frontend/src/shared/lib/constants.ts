export const APP_NAME = 'Mentora';

export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  courses: '/courses',
  course: (courseId: string) => `/courses/${courseId}`,
  courseEdit: (courseId: string) => `/courses/edit/${courseId}`,
  dashboard: '/dashboard',
  dashboardInstructor: '/dashboard/instructor',
  dashboardAdmin: '/dashboard/admin',
  learning: (courseId: string) => `/learning/${courseId}`,
  checkout: (courseId: string) => `/checkout/${courseId}`,
  myCourses: '/my-courses',
} as const;
