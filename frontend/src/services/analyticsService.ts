import api from './api';
import type { AnalyticsData, ApiResponse } from '@/types';

const ANALYTICS_ENDPOINT = '/admin/analytics';

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get<ApiResponse<AnalyticsData>>(ANALYTICS_ENDPOINT);
    return response.data.data!;
  },
};
