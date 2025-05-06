import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/query-client';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, CheckCircle, ExternalLink, HelpCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatedCard } from '@/components/ui/animated-card';

// Types for API integration settings
type ApiIntegrationConfig = {
  enabled: boolean;
  key?: string;
  endpoint?: string;
  username?: string;
  password?: string;
  version?: string;
  organization_id?: string;
  status: 'unconfigured' | 'configured' | 'verified' | 'error';
  lastVerified?: string;
  notes?: string;
};

type ApiSettings = {
  nmc: ApiIntegrationConfig;
  dbs: ApiIntegrationConfig;
  nhsGpConnect: ApiIntegrationConfig;
  dmAndD: ApiIntegrationConfig;
  o365: ApiIntegrationConfig;
};

export default function ApiIntegrationSettings() {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState<string | null>(null);

  // Fetch API integration settings
  const { data: apiSettings, isLoading, refetch } = useQuery({
    queryKey: ['api-integration-settings'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/settings/api-integrations');
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch API integration settings:', error);
        // Return default settings if API call fails
        return {
          nmc: { enabled: false, status: 'unconfigured' },
          dbs: { enabled: false, status: 'unconfigured' },
          nhsGpConnect: { enabled: false, status: 'unconfigured' },
          dmAndD: { enabled: false, status: 'unconfigured' },
          o365: { enabled: false, status: 'unconfigured' },
        } as ApiSettings;
      }
    },
  });

  // Mutation for saving API settings
  const saveMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<ApiSettings>) => {
      const res = await apiRequest('PATCH', '/api/settings/api-integrations', updatedSettings);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Settings Saved',
        description: 'API integration settings have been updated successfully.',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Failed to Save',
        description: error instanceof Error ? error.message : 'An error occurred while saving settings',
        variant: 'destructive',
      });
    },
  });

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async ({ apiName, config }: { apiName: string; config: ApiIntegrationConfig }) => {
      setIsValidating(apiName);
      const res = await apiRequest('POST', `/api/settings/api-integrations/${apiName}/validate`, { config });
      return res.json();
    },
    onSuccess: (data, variables) => {
      const { apiName } = variables;
      const success = data.success;
      
      if (success) {
        toast({
          title: 'Validation Successful',
          description: `The ${getApiDisplayName(apiName)} connection was validated successfully.`,
        });
        
        // Update the settings with the verified status
        const updatedSettings = { ...apiSettings } as ApiSettings;
        updatedSettings[apiName as keyof ApiSettings] = {
          ...updatedSettings[apiName as keyof ApiSettings],
          status: 'verified',
          lastVerified: new Date().toISOString(),
        };
        
        saveMutation.mutate(updatedSettings);
      } else {
        toast({
          title: 'Validation Failed',
          description: data.message || `Could not verify connection to ${getApiDisplayName(apiName)}.`,
          variant: 'destructive',
        });
      }
      
      setIsValidating(null);
    },
    onError: (error, variables) => {
      const { apiName } = variables;
      toast({
        title: 'Validation Error',
        description: error instanceof Error ? error.message : `An error occurred while validating ${getApiDisplayName(apiName)}`,
        variant: 'destructive',
      });
      setIsValidating(null);
    },
  });

  // Handle saving settings for an API
  const handleSaveApi = (apiName: keyof ApiSettings, updatedConfig: ApiIntegrationConfig) => {
    const updatedSettings = { ...apiSettings } as ApiSettings;
    updatedSettings[apiName] = {
      ...updatedSettings[apiName],
      ...updatedConfig,
      status: updatedConfig.enabled ? 'configured' : 'unconfigured',
    };
    
    saveMutation.mutate({ [apiName]: updatedSettings[apiName] });
  };

  // Handle validation for an API
  const handleValidateApi = (apiName: keyof ApiSettings) => {
    if (apiSettings) {
      validateMutation.mutate({
        apiName: apiName as string,
        config: apiSettings[apiName],
      });
    }
  };

  // Get display name for an API
  const getApiDisplayName = (apiName: string): string => {
    switch (apiName) {
      case 'nmc':
        return 'Nursing & Midwifery Council (NMC) API';
      case 'dbs':
        return 'Disclosure and Barring Service (DBS) API';
      case 'nhsGpConnect':
        return 'NHS GP Connect API';
      case 'dmAndD':
        return 'Dictionary of Medicines and Devices (DM+D) API';
      case 'o365':
        return 'Office 365 OAuth Integration';
      default:
        return apiName;
    }
  };

  // Get status badge for an API
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">Verified</Badge>;
      case 'configured':
        return <Badge>Configured</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'unconfigured':
      default:
        return <Badge variant="outline">Not Configured</Badge>;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>Loading integration settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default settings if API call fails
  const settings = apiSettings || {
    nmc: { enabled: false, status: 'unconfigured' },
    dbs: { enabled: false, status: 'unconfigured' },
    nhsGpConnect: { enabled: false, status: 'unconfigured' },
    dmAndD: { enabled: false, status: 'unconfigured' },
    o365: { enabled: false, status: 'unconfigured' },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>
            Configure third-party API integrations for enhanced functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nmc">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="nmc">NMC</TabsTrigger>
              <TabsTrigger value="dbs">DBS</TabsTrigger>
              <TabsTrigger value="nhs">NHS GP Connect</TabsTrigger>
              <TabsTrigger value="dmd">DM+D</TabsTrigger>
              <TabsTrigger value="o365">Office 365</TabsTrigger>
            </TabsList>

            {/* NMC API Tab */}
            <TabsContent value="nmc" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Nursing & Midwifery Council (NMC) API</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify nursing and midwifery professionals' registration and qualification details.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(settings.nmc.status)}
                  <Switch
                    checked={settings.nmc.enabled}
                    onCheckedChange={(checked) => {
                      handleSaveApi('nmc', { ...settings.nmc, enabled: checked });
                    }}
                  />
                </div>
              </div>

              {settings.nmc.enabled && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nmc-key">API Key</Label>
                      <Input
                        id="nmc-key"
                        type="password"
                        placeholder="Enter NMC API key"
                        value={settings.nmc.key || ''}
                        onChange={(e) => {
                          handleSaveApi('nmc', { ...settings.nmc, key: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nmc-endpoint">API Endpoint</Label>
                      <Input
                        id="nmc-endpoint"
                        placeholder="https://api.nmc.org.uk/v1"
                        value={settings.nmc.endpoint || ''}
                        onChange={(e) => {
                          handleSaveApi('nmc', { ...settings.nmc, endpoint: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>NMC API Registration</AlertTitle>
                    <AlertDescription>
                      To obtain API access credentials, you need to register with the NMC as a healthcare provider.
                      Visit the <a href="https://www.nmc.org.uk/registration/employer-confirmations/" target="_blank" rel="noopener noreferrer" className="underline">NMC Employer Portal</a> to register.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleValidateApi('nmc')}
                      disabled={isValidating === 'nmc' || !settings.nmc.key || !settings.nmc.endpoint}
                    >
                      {isValidating === 'nmc' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Validating
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Validate Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* DBS API Tab */}
            <TabsContent value="dbs" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Disclosure and Barring Service (DBS) API</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify staff criminal record and background check information.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(settings.dbs.status)}
                  <Switch
                    checked={settings.dbs.enabled}
                    onCheckedChange={(checked) => {
                      handleSaveApi('dbs', { ...settings.dbs, enabled: checked });
                    }}
                  />
                </div>
              </div>

              {settings.dbs.enabled && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dbs-endpoint">API Endpoint</Label>
                      <Input
                        id="dbs-endpoint"
                        placeholder="https://secure.crbonline.gov.uk/api/v1"
                        value={settings.dbs.endpoint || ''}
                        onChange={(e) => {
                          handleSaveApi('dbs', { ...settings.dbs, endpoint: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbs-organization-id">Organization ID</Label>
                      <Input
                        id="dbs-organization-id"
                        placeholder="Enter organization ID"
                        value={settings.dbs.organization_id || ''}
                        onChange={(e) => {
                          handleSaveApi('dbs', { ...settings.dbs, organization_id: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dbs-username">Username</Label>
                      <Input
                        id="dbs-username"
                        placeholder="Enter username"
                        value={settings.dbs.username || ''}
                        onChange={(e) => {
                          handleSaveApi('dbs', { ...settings.dbs, username: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbs-password">Password</Label>
                      <Input
                        id="dbs-password"
                        type="password"
                        placeholder="Enter password"
                        value={settings.dbs.password || ''}
                        onChange={(e) => {
                          handleSaveApi('dbs', { ...settings.dbs, password: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>DBS API Registration</AlertTitle>
                    <AlertDescription>
                      To obtain API access, you must be a registered DBS employer. Visit the
                      <a href="https://www.gov.uk/government/organisations/disclosure-and-barring-service" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        DBS portal
                      </a> for registration details.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleValidateApi('dbs')}
                      disabled={
                        isValidating === 'dbs' ||
                        !settings.dbs.endpoint ||
                        !settings.dbs.username ||
                        !settings.dbs.password
                      }
                    >
                      {isValidating === 'dbs' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Validating
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Validate Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* NHS GP Connect API Tab */}
            <TabsContent value="nhs" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">NHS GP Connect API</h3>
                  <p className="text-sm text-muted-foreground">
                    Access patient clinical information from GP systems securely.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(settings.nhsGpConnect.status)}
                  <Switch
                    checked={settings.nhsGpConnect.enabled}
                    onCheckedChange={(checked) => {
                      handleSaveApi('nhsGpConnect', { ...settings.nhsGpConnect, enabled: checked });
                    }}
                  />
                </div>
              </div>

              {settings.nhsGpConnect.enabled && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nhs-endpoint">API Endpoint</Label>
                      <Input
                        id="nhs-endpoint"
                        placeholder="https://api.gpconnect.nhs.uk/v1"
                        value={settings.nhsGpConnect.endpoint || ''}
                        onChange={(e) => {
                          handleSaveApi('nhsGpConnect', { ...settings.nhsGpConnect, endpoint: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nhs-key">API Key</Label>
                      <Input
                        id="nhs-key"
                        type="password"
                        placeholder="Enter NHS GP Connect API key"
                        value={settings.nhsGpConnect.key || ''}
                        onChange={(e) => {
                          handleSaveApi('nhsGpConnect', { ...settings.nhsGpConnect, key: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nhs-organization-id">Organization ODS Code</Label>
                      <Input
                        id="nhs-organization-id"
                        placeholder="Enter organization ODS code"
                        value={settings.nhsGpConnect.organization_id || ''}
                        onChange={(e) => {
                          handleSaveApi('nhsGpConnect', { ...settings.nhsGpConnect, organization_id: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nhs-version">API Version</Label>
                      <Input
                        id="nhs-version"
                        placeholder="1.2.7"
                        value={settings.nhsGpConnect.version || ''}
                        onChange={(e) => {
                          handleSaveApi('nhsGpConnect', { ...settings.nhsGpConnect, version: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>NHS Digital Requirements</AlertTitle>
                    <AlertDescription>
                      GP Connect API access requires NHS Digital approval and technical onboarding. Visit the
                      <a href="https://digital.nhs.uk/services/gp-connect" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        NHS Digital website
                      </a> for registration details.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleValidateApi('nhsGpConnect')}
                      disabled={
                        isValidating === 'nhsGpConnect' ||
                        !settings.nhsGpConnect.endpoint ||
                        !settings.nhsGpConnect.key
                      }
                    >
                      {isValidating === 'nhsGpConnect' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Validating
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Validate Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* DM+D API Tab */}
            <TabsContent value="dmd" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Dictionary of Medicines and Devices (DM+D) API</h3>
                  <p className="text-sm text-muted-foreground">
                    Access standardized UK medicine and medical device information.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(settings.dmAndD.status)}
                  <Switch
                    checked={settings.dmAndD.enabled}
                    onCheckedChange={(checked) => {
                      handleSaveApi('dmAndD', { ...settings.dmAndD, enabled: checked });
                    }}
                  />
                </div>
              </div>

              {settings.dmAndD.enabled && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dmd-endpoint">API Endpoint</Label>
                      <Input
                        id="dmd-endpoint"
                        placeholder="https://api.dmd.nhs.uk/v1"
                        value={settings.dmAndD.endpoint || ''}
                        onChange={(e) => {
                          handleSaveApi('dmAndD', { ...settings.dmAndD, endpoint: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dmd-key">API Key</Label>
                      <Input
                        id="dmd-key"
                        type="password"
                        placeholder="Enter DM+D API key"
                        value={settings.dmAndD.key || ''}
                        onChange={(e) => {
                          handleSaveApi('dmAndD', { ...settings.dmAndD, key: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>NHS Digital DM+D</AlertTitle>
                    <AlertDescription>
                      DM+D is the NHS standard dictionary for medicines and devices. For API access, visit the
                      <a href="https://digital.nhs.uk/services/dm-d-nhs-dictionary-of-medicines-and-devices" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        NHS Digital DM+D page
                      </a>.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleValidateApi('dmAndD')}
                      disabled={
                        isValidating === 'dmAndD' ||
                        !settings.dmAndD.endpoint ||
                        !settings.dmAndD.key
                      }
                    >
                      {isValidating === 'dmAndD' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Validating
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Validate Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Office 365 Integration Tab */}
            <TabsContent value="o365" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Office 365 OAuth Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable single sign-on and calendar integrations with Microsoft Office 365.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(settings.o365.status)}
                  <Switch
                    checked={settings.o365.enabled}
                    onCheckedChange={(checked) => {
                      handleSaveApi('o365', { ...settings.o365, enabled: checked });
                    }}
                  />
                </div>
              </div>

              {settings.o365.enabled && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="o365-client-id">Client ID</Label>
                      <Input
                        id="o365-client-id"
                        placeholder="Enter Microsoft application client ID"
                        value={settings.o365.key || ''}
                        onChange={(e) => {
                          handleSaveApi('o365', { ...settings.o365, key: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="o365-client-secret">Client Secret</Label>
                      <Input
                        id="o365-client-secret"
                        type="password"
                        placeholder="Enter Microsoft application client secret"
                        value={settings.o365.password || ''}
                        onChange={(e) => {
                          handleSaveApi('o365', { ...settings.o365, password: e.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="o365-tenant-id">Tenant ID</Label>
                    <Input
                      id="o365-tenant-id"
                      placeholder="Enter Microsoft tenant ID"
                      value={settings.o365.organization_id || ''}
                      onChange={(e) => {
                        handleSaveApi('o365', { ...settings.o365, organization_id: e.target.value });
                      }}
                    />
                  </div>

                  <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>Microsoft Azure AD Setup</AlertTitle>
                    <AlertDescription>
                      You need to register an application in the Azure portal and configure OAuth permissions. Visit the
                      <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        Microsoft documentation
                      </a> for detailed instructions.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleValidateApi('o365')}
                      disabled={
                        isValidating === 'o365' ||
                        !settings.o365.key ||
                        !settings.o365.password ||
                        !settings.o365.organization_id
                      }
                    >
                      {isValidating === 'o365' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Validating
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Validate Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatedCard header={<h3 className="text-md font-medium">Security Compliance</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              All API integrations use encrypted connections and credentials are stored securely.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">TLS 1.2+ Encryption</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">Encrypted Credential Storage</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">Regular Connection Validation</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard header={<h3 className="text-md font-medium">Data Protection</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              All integrations comply with UK data protection regulations and NHS Digital standards.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">GDPR Compliant</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">NHS Data Security & Protection Toolkit</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm">Audit Logging</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard header={<h3 className="text-md font-medium">API Documentation</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Access detailed documentation for each integration to assist with configuration.
            </p>
            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="https://www.nmc.org.uk/registration/employer-confirmations/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  NMC API Documentation
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="https://digital.nhs.uk/services/gp-connect" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  NHS GP Connect Guide
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="https://digital.nhs.uk/services/dm-d-nhs-dictionary-of-medicines-and-devices" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  DM+D Reference Guide
                </a>
              </Button>
            </div>
          </div>
        </AnimatedCard>
      </div>

      <Alert className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>API Integration Support</AlertTitle>
        <AlertDescription>
          If you need assistance with configuring these integrations, please contact our support team at <span className="font-medium">support@complexcare.com</span> or refer to the documentation links provided above.
        </AlertDescription>
      </Alert>
    </div>
  );
}
