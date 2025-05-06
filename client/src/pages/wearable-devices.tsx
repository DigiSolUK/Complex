import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { WearableDevice } from '@shared/schema';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui';
import WearableDeviceList from '@/components/wearables/wearable-device-list';
import { Loader2, BarChart4, Clock, Battery, Settings, Activity } from 'lucide-react';

export default function WearableDevices() {
  // Get patientId from URL if present
  const params = useParams<{ id?: string }>();
  const patientId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch patient data if patientId is available
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: patientId ? [`/api/patients/${patientId}`] : [],
    enabled: !!patientId,
  });

  // Fetch all wearable devices if no patientId
  const { data: allDevices, isLoading: isLoadingAllDevices } = useQuery({
    queryKey: ["/api/wearables"],
    enabled: !patientId,
  });

  const isLoading = (patientId && isLoadingPatient) || (!patientId && isLoadingAllDevices);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>
          {patientId && patient ? `${patient.name}'s Wearable Devices` : 'Wearable Devices Management'} | ComplexCare CRM
        </title>
      </Helmet>

      <PageHeader
        heading={patientId && patient ? `${patient.name}'s Wearable Devices` : 'Wearable Devices Management'}
        description={patientId && patient ? `Manage connected health monitoring devices for ${patient.name}` : 'View and manage all connected health monitoring devices'}
      />

      {patientId && patient ? (
        // Single patient view
        <WearableDeviceList patientId={patientId} />
      ) : (
        // All devices dashboard view
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">All Devices</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedCard hoverEffect="gentle-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Active Devices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {allDevices?.filter((d: WearableDevice) => d.connectionStatus === 'connected').length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Devices currently connected and syncing
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="gentle-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    Pending Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {allDevices?.filter((d: WearableDevice) => d.connectionStatus === 'pairing').length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Devices in pairing or setup process
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="gentle-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-red-500" />
                    Low Battery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {allDevices?.filter((d: WearableDevice) => d.batteryStatus && d.batteryStatus < 20).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Devices with less than 20% battery
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="gentle-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2 text-green-500" />
                    Readings Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">
                    Total readings in the last 24 hours
                  </p>
                </CardContent>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Device Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">Activity data will be shown here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['smartwatch', 'fitness_tracker', 'glucose_monitor', 'blood_pressure_monitor', 'pulse_oximeter'].map(type => {
                      const count = allDevices?.filter((d: WearableDevice) => d.deviceType === type).length || 0;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="rounded-md border">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allDevices?.length > 0 ? allDevices.map((device: WearableDevice) => (
                    <AnimatedCard key={device.id} hoverEffect="gentle-lift">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{device.manufacturer} {device.model}</CardTitle>
                          <Badge
                            className={device.connectionStatus === 'connected' ? 'bg-green-500' : 
                              device.connectionStatus === 'disconnected' ? 'bg-red-500' : 
                              device.connectionStatus === 'pairing' ? 'bg-yellow-500' : 'bg-gray-500'}
                          >
                            {device.connectionStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{device.deviceType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Patient:</span>
                            <span>ID: {device.patientId}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span>{device.lastSyncDate ? new Date(device.lastSyncDate).toLocaleString() : 'Never'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  )) : (
                    <div className="col-span-full p-8 text-center">
                      <p className="text-muted-foreground">No devices found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Alerts & Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">No current alerts or maintenance issues</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}