import { useState } from 'react';
import { Smartphone, Shield, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { PageHeader } from '@/components/layout/PageHeader';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatsBadge } from '@/components/ui/StatsBadge';
import { formatRelativeTime } from '@/utils/formatters';

const VERIFIED_OPTIONS = [
  { value: 'all', label: 'All Devices' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Unverified' },
];

interface ConfirmAction {
  type: 'verify' | 'unverify';
  deviceId: string;
  deviceInfo: string;
}

const DeviceStatusBadge = ({ verified }: { verified: boolean }) =>
  verified ? (
    <Badge variant="success" size="sm" className="gap-1">
      <CheckCircle className="w-3 h-3" />
      Verified
    </Badge>
  ) : (
    <Badge variant="warning" size="sm" className="gap-1">
      <XCircle className="w-3 h-3" />
      Unverified
    </Badge>
  );

export function Devices() {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const {
    devices,
    isLoading,
    search,
    verifiedFilter,
    handleSearchChange,
    handleVerifiedFilterChange,
    handleVerifyDevice,
    handleUnverifyDevice,
    isVerifying,
    isUnverifying,
  } = useDevices();

  const handleVerifyClick = (deviceId: string, deviceInfo: string) => {
    setConfirmAction({ type: 'verify', deviceId, deviceInfo });
  };

  const handleUnverifyClick = (deviceId: string, deviceInfo: string) => {
    setConfirmAction({ type: 'unverify', deviceId, deviceInfo });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'verify') {
        await handleVerifyDevice(confirmAction.deviceId);
      } else {
        await handleUnverifyDevice(confirmAction.deviceId);
      }
      setConfirmAction(null);
    } catch (error) {
      console.error('Device action failed:', error);
    }
  };

  const hasNoDevices = !isLoading && devices.length === 0;
  const unverifiedCount = devices.filter(d => !d.verified).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Devices"
        subtitle="Manage and verify customer devices"
        actions={
          unverifiedCount > 0 && (
            <StatsBadge icon={Shield} label="Pending" count={unverifiedCount} variant="orange" />
          )
        }
      />

      <div className="space-y-4 animate-fade-in flex-1">
        <Card>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="sm:w-80">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by device ID or user..."
              />
            </div>
            <div className="flex-1" />
            <Select
              value={verifiedFilter}
              onChange={handleVerifiedFilterChange}
              options={VERIFIED_OPTIONS}
            />
          </div>

          {isLoading ? (
            <LoadingState count={5} />
          ) : hasNoDevices ? (
            <EmptyState
              icon={Smartphone}
              title="No devices found"
              description={
                search
                  ? 'Try adjusting your search or filters'
                  : 'No devices have been registered yet'
              }
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Device Info</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map(device => (
                      <TableRow key={device.id}>
                        <TableCell className="font-mono text-xs">{device.deviceId}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                          {device.deviceInfo}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{device.user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {device.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DeviceStatusBadge verified={device.verified} />
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-xs">
                          {formatRelativeTime(device.createdAt)}
                        </TableCell>
                        <TableCell>
                          {device.verified ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnverifyClick(device.id, device.deviceInfo)}
                              disabled={isUnverifying}
                              className="gap-1.5 text-orange-600 hover:text-orange-700 dark:text-orange-400"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Unverify
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerifyClick(device.id, device.deviceInfo)}
                              disabled={isVerifying}
                              className="gap-1.5 text-green-600 hover:text-green-700 dark:text-green-400"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verify
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {devices.map(device => (
                  <div
                    key={device.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                          <span className="font-mono text-xs text-gray-900 dark:text-white truncate">
                            {device.deviceId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {device.deviceInfo}
                        </p>
                      </div>
                      <DeviceStatusBadge verified={device.verified} />
                    </div>

                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">User</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {device.user.email}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(device.createdAt)}
                      </p>
                      {device.verified ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnverifyClick(device.id, device.deviceInfo)}
                          disabled={isUnverifying}
                          className="gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Unverify
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyClick(device.id, device.deviceInfo)}
                          disabled={isVerifying}
                          className="gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={confirmAction.type === 'verify' ? 'Verify Device' : 'Unverify Device'}
          message={`Are you sure you want to ${confirmAction.type} this device: ${confirmAction.deviceInfo}?`}
          confirmText={confirmAction.type === 'verify' ? 'Verify' : 'Unverify'}
        />
      )}
    </div>
  );
}
