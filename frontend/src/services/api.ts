import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import type { ApiError, ApiResponse } from '@/types';
import { getAccessToken, getRefreshToken, saveTokens, clearAll } from './storage';

const REQUEST_TIMEOUT_MS = 30000;
const CONTENT_TYPE_JSON = 'application/json';
const AUTH_HEADER_PREFIX = 'Bearer';
const LOGIN_ROUTE = '/login';
const REFRESH_ENDPOINT = '/admin/auth/refresh';
const LOGIN_ENDPOINT = '/admin/auth/login';
const HTTP_UNAUTHORIZED = 401;

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': CONTENT_TYPE_JSON,
  },
});

const attachAuthToken = async (
  requestConfig: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const accessToken = getAccessToken();
  if (accessToken) {
    requestConfig.headers.Authorization = `${AUTH_HEADER_PREFIX} ${accessToken}`;
  }
  return requestConfig;
};

api.interceptors.request.use(attachAuthToken, error => Promise.reject(error));

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshingToken = false;
let requestQueue: QueuedRequest[] = [];

const processRequestQueue = (error: Error | null, token: string | null = null): void => {
  requestQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  requestQueue = [];
};

const isAuthEndpoint = (url?: string): boolean => {
  return url?.includes(LOGIN_ENDPOINT) || url?.includes(REFRESH_ENDPOINT) || false;
};

const redirectToLogin = (): void => {
  clearAll();
  window.location.href = LOGIN_ROUTE;
};

const queueFailedRequest = (originalRequest: InternalAxiosRequestConfig): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject });
  }).then(token => {
    originalRequest.headers.Authorization = `${AUTH_HEADER_PREFIX} ${token}`;
    return api(originalRequest);
  });
};

const refreshAccessToken = async (
  originalRequest: InternalAxiosRequestConfig
): Promise<unknown> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    redirectToLogin();
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${config.apiUrl}${REFRESH_ENDPOINT}`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data!;
    saveTokens(accessToken, newRefreshToken);

    originalRequest.headers.Authorization = `${AUTH_HEADER_PREFIX} ${accessToken}`;
    processRequestQueue(null, accessToken);

    return api(originalRequest);
  } catch (refreshError) {
    processRequestQueue(refreshError as Error, null);
    redirectToLogin();
    return Promise.reject(refreshError);
  } finally {
    isRefreshingToken = false;
  }
};

const handleUnauthorizedError = async (error: AxiosError<ApiError>): Promise<unknown> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status !== HTTP_UNAUTHORIZED || originalRequest._retry) {
    return Promise.reject(error);
  }

  if (isAuthEndpoint(originalRequest.url)) {
    redirectToLogin();
    return Promise.reject(error);
  }

  if (isRefreshingToken) {
    return queueFailedRequest(originalRequest);
  }

  originalRequest._retry = true;
  isRefreshingToken = true;

  return refreshAccessToken(originalRequest);
};

api.interceptors.response.use(response => response, handleUnauthorizedError);

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';
const NETWORK_ERROR_MESSAGE = 'Unable to connect to server. Please check your connection.';

const extractErrorMessages = (errors: Array<{ field?: string; message: string }>): string => {
  return errors.map(error => error.message).join(', ');
};

const parseApiError = (error: AxiosError<ApiError>): string => {
  if (!error.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  const apiError = error.response.data;

  if (apiError?.message) {
    return apiError.message;
  }

  if (apiError?.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return extractErrorMessages(apiError.errors);
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
};

export const handleApiError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return parseApiError(error);
};

export default api;
