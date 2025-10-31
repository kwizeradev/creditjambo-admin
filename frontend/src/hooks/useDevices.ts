import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { deviceService, type DeviceWithUser } from '@/services/deviceService';
import { handleApiError } from '@/services/api';

const DEVICES_QUERY_KEY = 'devices';

const filterDevicesBySearch = (devices: DeviceWithUser[], search: string): DeviceWithUser[] => {
  if (!search) return devices;

  const searchLower = search.toLowerCase();
  return devices.filter(device => {
    if (device.deviceId.startsWith('admin-')) {
      return false;
    }
    return (
      device.deviceId.toLowerCase().includes(searchLower) ||
      device.user.email.toLowerCase().includes(searchLower) ||
      device.user.name.toLowerCase().includes(searchLower)
    );
  });
};

export const useDevices = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: [DEVICES_QUERY_KEY, verifiedFilter],
    queryFn: () =>
      deviceService.getDevices({
        filter: verifiedFilter !== 'all' ? verifiedFilter : undefined,
      }),
  });

  const filteredDevices = useMemo(() => {
    if (!data?.devices) return [];
    const nonAdminDevices = data.devices.filter(d => !d.deviceId.startsWith('admin-'));
    return filterDevicesBySearch(nonAdminDevices, search);
  }, [data?.devices, search]);

  const verifyMutation = useMutation({
    mutationFn: deviceService.verifyDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
    },
    onError: error => {
      throw new Error(handleApiError(error));
    },
  });

  const unverifyMutation = useMutation({
    mutationFn: deviceService.unverifyDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
    },
    onError: error => {
      throw new Error(handleApiError(error));
    },
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleVerifiedFilterChange = useCallback((value: string) => {
    setVerifiedFilter(value);
  }, []);

  const handleVerifyDevice = useCallback(
    async (deviceId: string) => {
      await verifyMutation.mutateAsync(deviceId);
    },
    [verifyMutation]
  );

  const handleUnverifyDevice = useCallback(
    async (deviceId: string) => {
      await unverifyMutation.mutateAsync(deviceId);
    },
    [unverifyMutation]
  );

  return {
    devices: filteredDevices,
    total: data?.total || 0,
    isLoading,
    error,
    search,
    verifiedFilter,
    handleSearchChange,
    handleVerifiedFilterChange,
    handleVerifyDevice,
    handleUnverifyDevice,
    isVerifying: verifyMutation.isPending,
    isUnverifying: unverifyMutation.isPending,
  };
};
