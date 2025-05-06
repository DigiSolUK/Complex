import React from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import DeviceReadingsChart from '@/components/wearables/device-readings-chart';
import { Loader2, ChevronLeft, Settings } from 'lucide-react';

export default function WearableDeviceData() {
  const [, navigate] = useLocation();
  const params = useParams<{ patientId?: string, deviceId?: string }>();
  
  // Ensure we have the required params
  const patientId = params?.patientId ? parseInt(params.patientId) : undefined;
  const deviceId = params?.deviceId ? parseInt(params.deviceId) : undefined;
  
  // Redirect if missing required params
  if (!patientId || !deviceId) {
    // Use React's useEffect for redirection to avoid errors during rendering
    React.useEffect(() => {
      navigate('/patients');
    }, []);
    return null;
  }
  
  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: patientId ? [`/api/patients/${patientId}`] : [],
    enabled: !!patientId,
  });
  
  // Fetch device data
  const { data: device, isLoading: isLoadingDevice } = useQuery({
    queryKey: deviceId ? [`/api/wearables/${deviceId}`] : [],
    enabled: !!deviceId,
  });
  
  const isLoading = isLoadingPatient || isLoadingDevice;

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
          {device?.manufacturer} {device?.model} Data | {patient?.name} | ComplexCare CRM
        </title>
      </Helmet>

      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/patients/${patientId}`}>{patient?.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/patients/${patientId}/wearables`}>Wearable Devices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{device?.manufacturer} {device?.model}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <PageHeader
            heading={`${device?.manufacturer} ${device?.model} Data`}
            description={`View health data from ${patient?.name}'s ${device?.deviceType.replace('_', ' ')}`}
          />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/patients/${patientId}/wearables`)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/patients/${patientId}/wearables/${deviceId}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Device Settings
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DeviceReadingsChart deviceId={deviceId} patientId={patientId} />
        </CardContent>
      </Card>
    </div>
  );
}