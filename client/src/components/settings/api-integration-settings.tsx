import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/query-client';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, CheckCircle, AlertCircle, XCircle, Shield, Fingerprint, Database, Globe, Building2, RefreshCw, Check, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ApiConfig = {
  enabled: boolean;
  status: 'unconfigured' | 'configured' | 'error' | 'verified';
  apiKey?: string;
  organizationId?: string;
  environment?: 'test' | 'production';
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  resourceUrl?: string;
  redirectUri?: string;
  scopes?: string;
  tenantId?: string;
};

type ApiSettings = {
  nmc: ApiConfig;
  dbs: ApiConfig;
  nhsGpConnect: ApiConfig;
  dmAndD: ApiConfig;
  o365: ApiConfig;
};

export default function ApiIntegrationSettings() {
  const { toast } = useToast();
  
  // Fetch API settings
  const { data: apiSettings, isLoading } = useQuery({
    queryKey: ["/api/settings/api-integrations"],
    refetchOnWindowFocus: false,
  });
  
  // Default settings
  const defaultSettings: ApiSettings = {
    nmc: { enabled: false, status: 'unconfigured' },
    dbs: { enabled: false, status: 'unconfigured' },
    nhsGpConnect: { enabled: false, status: 'unconfigured' },
    dmAndD: { enabled: false, status: 'unconfigured' },
    o365: { enabled: false, status: 'unconfigured' },
  };
  
  // Initialize settings state with fetched data or defaults
  const [settings, setSettings] = useState<ApiSettings>(defaultSettings);
  
  // Update settings when data is fetched
  React.useEffect(() => {
    if (apiSettings) {
      setSettings(apiSettings as ApiSettings);
    }
  }, [apiSettings]);
  
  // Mutation to save API settings
  const saveMutation = useMutation({
    mutationFn: async (updatedSettings: ApiSettings) => {
      const response = await apiRequest('PATCH', '/api/settings/api-integrations', updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Settings saved',
        description: 'API integration settings have been updated successfully',
        className: "bg-green-600 text-white",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/api-integrations"] });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to validate API connection
  const validateMutation = useMutation({
    mutationFn: async ({ apiName, config }: { apiName: string; config: ApiConfig }) => {
      const response = await apiRequest(
        'POST', 
        `/api/settings/api-integrations/${apiName}/validate`, 
        { config }
      );
      return response.json();
    },
    onSuccess: (data, variables) => {
      const { apiName } = variables;
      setSettings(prev => ({
        ...prev,
        [apiName]: {
          ...prev[apiName as keyof ApiSettings],
          status: 'verified'
        }
      }));
      
      toast({
        title: 'API connection successful',
        description: `Successfully connected to ${getApiDisplayName(apiName)}`,
        className: "bg-green-600 text-white",
      });
    },
    onError: (error, variables) => {
      const { apiName } = variables;
      setSettings(prev => ({
        ...prev,
        [apiName]: {
          ...prev[apiName as keyof ApiSettings],
          status: 'error'
        }
      }));
      
      toast({
        title: 'API connection failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const handleSaveSettings = () => {
    saveMutation.mutate(settings);
  };
  
  // Helper to validate a connection
  const validateConnection = (apiName: string) => {
    const config = settings[apiName as keyof ApiSettings];
    validateMutation.mutate({ apiName, config });
  };
  
  // Handle toggle changes
  const handleToggle = (apiName: keyof ApiSettings) => {
    setSettings(prev => ({
      ...prev,
      [apiName]: {
        ...prev[apiName],
        enabled: !prev[apiName].enabled,
        status: !prev[apiName].enabled ? 'configured' : 'unconfigured'
      }
    }));
  };
  
  // Handle input changes
  const handleChange = (apiName: keyof ApiSettings, field: keyof ApiConfig, value: string) => {
    setSettings(prev => ({
      ...prev,
      [apiName]: {
        ...prev[apiName],
        [field]: value,
        status: 'configured' // Change status to configured when settings are changed
      }
    }));
  };
  
  // Helper to get display name
  const getApiDisplayName = (apiName: string): string => {
    switch (apiName) {
      case 'nmc':
        return 'Nursing & Midwifery Council (NMC)';
      case 'dbs':
        return 'Disclosure and Barring Service (DBS)';
      case 'nhsGpConnect':
        return 'NHS GP Connect';
      case 'dmAndD':
        return 'Dictionary of Medicines and Devices (dm+d)';
      case 'o365':
        return 'Office 365';
      default:
        return apiName;
    }
  };
  
  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'configured':
        return <Badge><AlertCircle className="h-3 w-3 mr-1" />Not Verified</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Connection Error</Badge>;
      case 'unconfigured':
      default:
        return <Badge variant="outline"><HelpCircle className="h-3 w-3 mr-1" />Not Configured</Badge>;
    }
  };
  
  // Get icon for API
  const getApiIcon = (apiName: string) => {
    switch (apiName) {
      case 'nmc':
        return <Building2 className="h-5 w-5" />;
      case 'dbs':
        return <Shield className="h-5 w-5" />;
      case 'nhsGpConnect':
        return <Database className="h-5 w-5" />;
      case 'dmAndD':
        return <Globe className="h-5 w-5" />;
      case 'o365':
        return <Fingerprint className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>
            Configure third-party API integrations for enhanced functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="healthcare" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="healthcare">Healthcare APIs</TabsTrigger>
              <TabsTrigger value="office">Office 365 Integration</TabsTrigger>
            </TabsList>
            
            {/* Healthcare APIs Tab */}
            <TabsContent value="healthcare" className="space-y-4 pt-4">
              {/* NMC API */}
              <AnimatedCard
                emotionalState={settings.nmc.status === 'verified' ? 'success' : 
                               settings.nmc.status === 'error' ? 'error' : 'neutral'}
                header={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getApiIcon('nmc')}
                      <span>Nursing & Midwifery Council (NMC)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(settings.nmc.status)}
                      <Switch 
                        checked={settings.nmc.enabled} 
                        onCheckedChange={() => handleToggle('nmc')} 
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect to the NMC API to verify nurse and midwife registrations automatically.
                  </p>
                  
                  {settings.nmc.enabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nmc-apikey">API Key</Label>
                          <Input 
                            id="nmc-apikey" 
                            type="password" 
                            value={settings.nmc.apiKey || ''} 
                            onChange={(e) => handleChange('nmc', 'apiKey', e.target.value)} 
                            placeholder="Enter your NMC API key"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nmc-orgid">Organization ID</Label>
                          <Input 
                            id="nmc-orgid" 
                            value={settings.nmc.organizationId || ''} 
                            onChange={(e) => handleChange('nmc', 'organizationId', e.target.value)} 
                            placeholder="e.g. ORG-12345"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => validateConnection('nmc')}
                          disabled={validateMutation.isPending}
                        >
                          {validateMutation.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
              
              {/* DBS API */}
              <AnimatedCard
                emotionalState={settings.dbs.status === 'verified' ? 'success' : 
                               settings.dbs.status === 'error' ? 'error' : 'neutral'}
                header={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getApiIcon('dbs')}
                      <span>Disclosure and Barring Service (DBS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(settings.dbs.status)}
                      <Switch 
                        checked={settings.dbs.enabled} 
                        onCheckedChange={() => handleToggle('dbs')} 
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect to the DBS API for automated background check verification and updates.
                  </p>
                  
                  {settings.dbs.enabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dbs-username">Username</Label>
                          <Input 
                            id="dbs-username" 
                            value={settings.dbs.username || ''} 
                            onChange={(e) => handleChange('dbs', 'username', e.target.value)} 
                            placeholder="Enter your DBS username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dbs-password">Password</Label>
                          <Input 
                            id="dbs-password" 
                            type="password" 
                            value={settings.dbs.password || ''} 
                            onChange={(e) => handleChange('dbs', 'password', e.target.value)} 
                            placeholder="Enter your DBS password"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dbs-orgid">Organization ID</Label>
                        <Input 
                          id="dbs-orgid" 
                          value={settings.dbs.organizationId || ''} 
                          onChange={(e) => handleChange('dbs', 'organizationId', e.target.value)} 
                          placeholder="e.g. DBS-12345"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => validateConnection('dbs')}
                          disabled={validateMutation.isPending}
                        >
                          {validateMutation.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
              
              {/* NHS GP Connect */}
              <AnimatedCard
                emotionalState={settings.nhsGpConnect.status === 'verified' ? 'success' : 
                               settings.nhsGpConnect.status === 'error' ? 'error' : 'neutral'}
                header={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getApiIcon('nhsGpConnect')}
                      <span>NHS GP Connect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(settings.nhsGpConnect.status)}
                      <Switch 
                        checked={settings.nhsGpConnect.enabled} 
                        onCheckedChange={() => handleToggle('nhsGpConnect')} 
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect to NHS GP Connect API to access patient medical records from GP practices.
                  </p>
                  
                  {settings.nhsGpConnect.enabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gpc-clientid">Client ID</Label>
                          <Input 
                            id="gpc-clientid" 
                            value={settings.nhsGpConnect.clientId || ''} 
                            onChange={(e) => handleChange('nhsGpConnect', 'clientId', e.target.value)} 
                            placeholder="Enter your NHS client ID"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gpc-clientsecret">Client Secret</Label>
                          <Input 
                            id="gpc-clientsecret" 
                            type="password" 
                            value={settings.nhsGpConnect.clientSecret || ''} 
                            onChange={(e) => handleChange('nhsGpConnect', 'clientSecret', e.target.value)} 
                            placeholder="Enter your NHS client secret"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gpc-resourceurl">API Endpoint URL</Label>
                        <Input 
                          id="gpc-resourceurl" 
                          value={settings.nhsGpConnect.resourceUrl || ''} 
                          onChange={(e) => handleChange('nhsGpConnect', 'resourceUrl', e.target.value)} 
                          placeholder="e.g. https://api.nhs.net/gpconnect/"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => validateConnection('nhsGpConnect')}
                          disabled={validateMutation.isPending}
                        >
                          {validateMutation.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
              
              {/* Dictionary of Medicines and Devices (dm+d) */}
              <AnimatedCard
                emotionalState={settings.dmAndD.status === 'verified' ? 'success' : 
                               settings.dmAndD.status === 'error' ? 'error' : 'neutral'}
                header={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getApiIcon('dmAndD')}
                      <span>Dictionary of Medicines and Devices (dm+d)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(settings.dmAndD.status)}
                      <Switch 
                        checked={settings.dmAndD.enabled} 
                        onCheckedChange={() => handleToggle('dmAndD')} 
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect to the NHS dm+d API for accurate medication references and information.
                  </p>
                  
                  {settings.dmAndD.enabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dmd-apikey">API Key</Label>
                          <Input 
                            id="dmd-apikey" 
                            type="password" 
                            value={settings.dmAndD.apiKey || ''} 
                            onChange={(e) => handleChange('dmAndD', 'apiKey', e.target.value)} 
                            placeholder="Enter your dm+d API key"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dmd-env">Environment</Label>
                          <Input 
                            id="dmd-env" 
                            value={settings.dmAndD.environment || 'test'} 
                            onChange={(e) => handleChange('dmAndD', 'environment', e.target.value as 'test' | 'production')} 
                            placeholder="test or production"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => validateConnection('dmAndD')}
                          disabled={validateMutation.isPending}
                        >
                          {validateMutation.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </TabsContent>
            
            {/* Office 365 Integration Tab */}
            <TabsContent value="office" className="space-y-4 pt-4">
              <AnimatedCard
                emotionalState={settings.o365.status === 'verified' ? 'success' : 
                               settings.o365.status === 'error' ? 'error' : 'neutral'}
                header={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getApiIcon('o365')}
                      <span>Office 365 Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(settings.o365.status)}
                      <Switch 
                        checked={settings.o365.enabled} 
                        onCheckedChange={() => handleToggle('o365')} 
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure Office 365 integration for calendar synchronization, email notifications, and document management.
                  </p>
                  
                  {settings.o365.enabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="o365-clientid">Client ID (App ID)</Label>
                          <Input 
                            id="o365-clientid" 
                            value={settings.o365.clientId || ''} 
                            onChange={(e) => handleChange('o365', 'clientId', e.target.value)} 
                            placeholder="Enter your Microsoft App ID"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="o365-tenantid">Tenant ID</Label>
                          <Input 
                            id="o365-tenantid" 
                            value={settings.o365.tenantId || ''} 
                            onChange={(e) => handleChange('o365', 'tenantId', e.target.value)} 
                            placeholder="Enter your Microsoft Tenant ID"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="o365-clientsecret">Client Secret</Label>
                        <Input 
                          id="o365-clientsecret" 
                          type="password" 
                          value={settings.o365.clientSecret || ''} 
                          onChange={(e) => handleChange('o365', 'clientSecret', e.target.value)} 
                          placeholder="Enter your Microsoft client secret"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="o365-redirecturi">Redirect URI</Label>
                        <Input 
                          id="o365-redirecturi" 
                          value={settings.o365.redirectUri || ''} 
                          onChange={(e) => handleChange('o365', 'redirectUri', e.target.value)} 
                          placeholder="e.g. https://yourdomain.com/auth/microsoft/callback"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="o365-scopes">Scopes</Label>
                        <Input 
                          id="o365-scopes" 
                          value={settings.o365.scopes || ''} 
                          onChange={(e) => handleChange('o365', 'scopes', e.target.value)} 
                          placeholder="e.g. User.Read Calendar.ReadWrite Mail.Send"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => validateConnection('o365')}
                          disabled={validateMutation.isPending}
                        >
                          {validateMutation.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button 
            onClick={handleSaveSettings}
            disabled={saveMutation.isPending}
            className="ml-auto"
          >
            {saveMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
