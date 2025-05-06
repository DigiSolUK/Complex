import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { WearableDevice } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, RefreshCw, Trash2, Settings, LinkIcon, Activity } from 'lucide-react';
import { AnimatedButton, AnimatedCard } from '@/components/ui';
import WearableDeviceForm from './wearable-device-form';

export default function WearableDeviceList({ patientId }: { patientId: number }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  // Fetch wearable devices for this patient
  const { data: wearableDevices, isLoading, isError } = useQuery({
    queryKey: [`/api/patients/${patientId}/wearables`],
    enabled: !!patientId,
  });
  
  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      const res = await fetch(`/api/wearables/${deviceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete device');
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: 'Device removed successfully',
        description: 'The wearable device has been removed from this patient.',
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/wearables`] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error removing device',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle sync device
  const syncDeviceMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      const res = await fetch(`/api/wearables/${deviceId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to sync device');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Device synced successfully',
        description: 'The latest data has been retrieved from the device.',
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/wearables`] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error syncing device',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'pairing': return 'bg-yellow-500';
      case 'error': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryStatusColor = (percentage?: number) => {
    if (!percentage && percentage !== 0) return 'bg-gray-400';
    if (percentage < 20) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Failed to load wearable devices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Connected Devices</h3>
        <AnimatedButton 
          onClick={() => setShowAddForm(!showAddForm)}
          emotionalState="calm"
          variant="outline"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Device'}
        </AnimatedButton>
      </div>

      {showAddForm && (
        <AnimatedCard>
          <CardHeader>
            <CardTitle>Add New Wearable Device</CardTitle>
            <CardDescription>
              Connect a new wearable device to monitor this patient's health metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WearableDeviceForm 
              patientId={patientId} 
              onSuccess={() => {
                setShowAddForm(false);
                queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/wearables`] });
              }}
            />
          </CardContent>
        </AnimatedCard>
      )}

      {wearableDevices?.length === 0 ? (
        <div className="bg-muted/30 border rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">No wearable devices connected</p>
          {!showAddForm && (
            <AnimatedButton 
              onClick={() => setShowAddForm(true)}
              emotionalState="calm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />Add First Device
            </AnimatedButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wearableDevices?.map((device: WearableDevice) => (
            <AnimatedCard key={device.id} hoverEffect="gentle-lift">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{device.manufacturer} {device.model}</CardTitle>
                  <Badge
                    className={`${getConnectionStatusColor(device.connectionStatus)}`}
                  >
                    {device.connectionStatus}
                  </Badge>
                </div>
                <CardDescription>
                  {device.deviceType.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Serial Number:</span>
                    <span>{device.serialNumber}</span>
                  </div>
                  {device.batteryStatus !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Battery:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-3 bg-gray-200 rounded-full mr-2 overflow-hidden">
                          <div 
                            className={`h-full ${getBatteryStatusColor(device.batteryStatus)}`}
                            style={{ width: `${device.batteryStatus}%` }}
                          />
                        </div>
                        <span>{device.batteryStatus}%</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>
                      {device.lastSyncDate 
                        ? new Date(device.lastSyncDate).toLocaleString() 
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => syncDeviceMutation.mutate(device.id)}
                    disabled={syncDeviceMutation.isPending}
                  >
                    {syncDeviceMutation.isPending 
                      ? <Loader2 className="h-4 w-4 animate-spin" /> 
                      : <RefreshCw className="h-4 w-4" />}
                    <span className="sr-only">Sync</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/patients/${patientId}/wearables/${device.id}/data`}
                  >
                    <Activity className="h-4 w-4" />
                    <span className="sr-only">View Data</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/patients/${patientId}/wearables/${device.id}/settings`}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this device?')) {
                      deleteDeviceMutation.mutate(device.id);
                    }
                  }}
                  disabled={deleteDeviceMutation.isPending}
                >
                  {deleteDeviceMutation.isPending 
                    ? <Loader2 className="h-4 w-4 animate-spin" /> 
                    : <Trash2 className="h-4 w-4" />}
                  <span className="sr-only">Remove</span>
                </Button>
              </CardFooter>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}