export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
} as const;
