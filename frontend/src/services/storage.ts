import type { User } from '@/types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'admin_access_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER: 'admin_user',
} as const;

const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

const getItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

const serializeUser = (user: User): string => {
  return JSON.stringify(user);
};

const deserializeUser = (userString: string): User | null => {
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = (): string | null => {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const clearTokens = (): void => {
  removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const saveUser = (user: User): void => {
  const serializedUser = serializeUser(user);
  setItem(STORAGE_KEYS.USER, serializedUser);
};

export const getUser = (): User | null => {
  const userString = getItem(STORAGE_KEYS.USER);
  if (!userString) {
    return null;
  }

  return deserializeUser(userString);
};

export const clearUser = (): void => {
  removeItem(STORAGE_KEYS.USER);
};

export const clearAll = (): void => {
  clearTokens();
  clearUser();
};
