import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { WearableDevice } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AnimatedCard } from '@/components/ui';
import { Loader2, Plus, RefreshCw, Wifi, WifiOff, AlertCircle, Battery, Settings } from 'lucide-react';

interface WearableDeviceListProps {
  patientId?: number;
}

const formatDateRelative = (date: string | null): string => {
  if (!date) return 'Never';
  
  const now = new Date();
  const syncDate = new Date(date);
  const diffMs = now.getTime() - syncDate.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return syncDate.toLocaleDateString();
};

const getConnectionStatusBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return (
        <Badge className="bg-green-500">
          <Wifi className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      );
    case 'disconnected':
      return (
        <Badge className="bg-red-500">
          <WifiOff className="h-3 w-3 mr-1" />
          Disconnected
        </Badge>
      );
    case 'pairing':
      return (
        <Badge className="bg-yellow-500">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Pairing
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          Unknown
        </Badge>
      );
  }
};

const getBatteryStatusIndicator = (batteryStatus: number | null) => {
  if (batteryStatus === null) return null;
  
  let color = 'text-green-500';
  if (batteryStatus < 20) color = 'text-red-500';
  else if (batteryStatus < 50) color = 'text-yellow-500';
  
  return (
    <div className="flex items-center">
      <Battery className={`h-4 w-4 mr-1 ${color}`} />
      <span className="text-sm text-muted-foreground">{batteryStatus}%</span>
    </div>
  );
};

const WearableDeviceList: React.FC<WearableDeviceListProps> = ({ patientId }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  
  // Fetch devices for a specific patient or all devices
  const { data: devices, isLoading, error } = useQuery({
    queryKey: patientId ? [`/api/patients/${patientId}/wearables`] : ['/api/wearables'],
    enabled: true,
  });
  
  // Sync device mutation
  const syncDeviceMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      const response = await fetch(`/api/wearables/${deviceId}/sync`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync device');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/wearables`] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/wearables'] });
      }
      
      toast({
        title: 'Device synced',
        description: 'The device has been successfully synced',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Sync failed',
        description: error.message || 'Failed to sync device',
        variant: 'destructive',
      });
    },
  });
  
  const handleSyncDevice = (deviceId: number) => {
    syncDeviceMutation.mutate(deviceId);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">Error loading devices</p>
        </div>
        <p className="text-sm text-red-600 mt-2">{(error as Error).message}</p>
      </div>
    );
  }
  
  if (!devices || devices.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Wifi className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No Wearable Devices</h3>
        <p className="text-muted-foreground mb-4">
          {patientId
            ? 'This patient doesn\'t have any connected wearable devices.'
            : 'There are no wearable devices in the system.'}
        </p>
        <Button onClick={() => setIsAddDeviceDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Connected Devices</h3>
          <p className="text-sm text-muted-foreground">
            {patientId
              ? `Manage this patient's connected health monitoring devices`
              : 'View and manage all connected health monitoring devices'}
          </p>
        </div>
        <Button onClick={() => setIsAddDeviceDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device: WearableDevice) => (
          <AnimatedCard key={device.id} hoverEffect="gentle-lift">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">
                  {device.manufacturer} {device.model}
                </CardTitle>
                {getConnectionStatusBadge(device.connectionStatus)}
              </div>
              <CardDescription>
                {device.deviceType.replace('_', ' ')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serial Number:</span>
                  <span className="font-mono">{device.serialNumber}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span>{formatDateRelative(device.lastSyncDate)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Battery:</span>
                  {getBatteryStatusIndicator(device.batteryStatus)}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="justify-between pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSyncDevice(device.id)}
                disabled={syncDeviceMutation.isPending}
              >
                {syncDeviceMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate(`/patients/${device.patientId}/wearables/${device.id}/data`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                View Data
              </Button>
            </CardFooter>
          </AnimatedCard>
        ))}
      </div>
      
      {/* TODO: Create and implement WearableDeviceForm component for the dialog */}
      <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Wearable Device</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p>Device form will be implemented here.</p>
            <Button className="mt-4" onClick={() => setIsAddDeviceDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WearableDeviceList;