import api from './api';
import type { ApiResponse } from '@/types';

const DEVICES_ENDPOINT = '/admin/devices';

export interface DeviceWithUser {
  id: string;
  deviceId: string;
  deviceInfo: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface GetDevicesParams {
  filter?: string;
}

interface GetDevicesResponse {
  devices: DeviceWithUser[];
  total: number;
}

export const deviceService = {
  getDevices: async (params: GetDevicesParams): Promise<GetDevicesResponse> => {
    const response = await api.get<ApiResponse<GetDevicesResponse>>(DEVICES_ENDPOINT, { params });
    return response.data.data!;
  },

  verifyDevice: async (deviceId: string): Promise<void> => {
    await api.patch(`${DEVICES_ENDPOINT}/${deviceId}/verify`);
  },

  unverifyDevice: async (deviceId: string): Promise<void> => {
    await api.patch(`${DEVICES_ENDPOINT}/${deviceId}/unverify`);
  },
};
