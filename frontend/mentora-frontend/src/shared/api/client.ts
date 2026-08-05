import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@shared/lib/constants';
import { tokenStorage } from '@shared/lib/token-storage';
import { getAuth } from './generated/auth/auth';
import { getCourses } from './generated/courses/courses';
import { getAnalytics } from './generated/analytics/analytics';
import { getLessons } from './generated/lessons/lessons';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Инстанс без интерсепторов — используется только для refresh-запроса,
// чтобы не зациклиться на собственном response-интерсепторе apiClient.
const refreshClient = axios.create({ baseURL: API_URL });
export const authApi = getAuth(apiClient);
export const coursesApi = getCourses(apiClient);
export const lessonsApi = getLessons(apiClient);
const authRefreshApi = getAuth(refreshClient);
export const analyticsApi = getAnalytics(apiClient);

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.includes(endpoint),
    );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(apiClient(originalRequest)));
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw error;
      }
      const { data } = await authRefreshApi.refreshToken({ refreshToken });
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      pendingRequests.forEach((run) => run());
      pendingRequests = [];
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
