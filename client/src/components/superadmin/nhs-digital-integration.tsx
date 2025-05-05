import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// NHS Digital Integration form schema
const nhsIntegrationSchema = z.object({
  tenantId: z.number(),
  pdsApiKey: z.string().optional(),
  pdsEnabled: z.boolean().default(false),
  scrApiKey: z.string().optional(),
  scrEnabled: z.boolean().default(false),
  epsApiKey: z.string().optional(),
  epsEnabled: z.boolean().default(false),
  eRsApiKey: z.string().optional(),
  eRsEnabled: z.boolean().default(false),
  gpConnectApiKey: z.string().optional(),
  gpConnectEnabled: z.boolean().default(false),
  environmentType: z.enum(["sandbox", "production"]).default("sandbox"),
});

type NhsIntegrationFormValues = z.infer<typeof nhsIntegrationSchema>;

export interface NhsDigitalIntegrationProps {
  tenantId: number;
}

export function NhsDigitalIntegration({ tenantId }: NhsDigitalIntegrationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeService, setActiveService] = useState<string>("pds");

  // Fetch NHS Digital integration settings
  const { data: nhsIntegration, isLoading } = useQuery({
    queryKey: [`/api/superadmin/tenants/${tenantId}/nhs-integration`],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/superadmin/tenants/${tenantId}/nhs-integration`);
        return await res.json();
      } catch (error) {
        // If the integration doesn't exist yet, return default values
        return {
          tenantId,
          pdsEnabled: false,
          scrEnabled: false,
          epsEnabled: false,
          eRsEnabled: false,
          gpConnectEnabled: false,
          environmentType: "sandbox",
        };
      }
    },
  });

  // Form setup
  const form = useForm<NhsIntegrationFormValues>({
    resolver: zodResolver(nhsIntegrationSchema),
    defaultValues: {
      tenantId,
      pdsEnabled: false,
      scrEnabled: false,
      epsEnabled: false,
      eRsEnabled: false,
      gpConnectEnabled: false,
      environmentType: "sandbox",
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (nhsIntegration) {
      form.reset(nhsIntegration);
    }
  }, [nhsIntegration, form]);

  // Save NHS integration settings
  const saveMutation = useMutation({
    mutationFn: async (values: NhsIntegrationFormValues) => {
      const res = await apiRequest(
        "POST",
        `/api/superadmin/tenants/${tenantId}/nhs-integration`,
        values
      );
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "NHS Digital Integration Updated",
        description: "NHS Digital Integration settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/superadmin/tenants/${tenantId}/nhs-integration`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update NHS Digital Integration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test connection to NHS Digital APIs
  const testConnectionMutation = useMutation({
    mutationFn: async (service: string) => {
      const res = await apiRequest(
        "POST",
        `/api/superadmin/tenants/${tenantId}/nhs-integration/test`,
        { service }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Test Successful",
        description: `Successfully connected to NHS Digital ${data.service.toUpperCase()} API.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: NhsIntegrationFormValues) => {
    saveMutation.mutate(values);
  };

  const handleTestConnection = (service: string) => {
    testConnectionMutation.mutate(service);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading NHS Digital integration settings...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NHS Digital Integration</CardTitle>
        <CardDescription>
          Connect this tenant to NHS Digital services. These settings will allow the tenant to access patient information, prescriptions, and other NHS services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="environmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sandbox">
                        Sandbox (Testing)
                      </SelectItem>
                      <SelectItem value="production">
                        Production (Live)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the NHS Digital environment to connect to. Use Sandbox for testing and Production for live deployments.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Tabs value={activeService} onValueChange={setActiveService}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="pds">
                    PDS
                    {form.watch("pdsEnabled") && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Enabled</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="scr">
                    SCR
                    {form.watch("scrEnabled") && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Enabled</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="eps">
                    EPS
                    {form.watch("epsEnabled") && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Enabled</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="ers">
                    e-RS
                    {form.watch("eRsEnabled") && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Enabled</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="gpconnect">
                    GP Connect
                    {form.watch("gpConnectEnabled") && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Enabled</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pds" className="space-y-4 p-4 border rounded-md mt-4">
                  <div>
                    <h3 className="text-lg font-medium">Personal Demographics Service (PDS)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      National database of NHS patient details such as name, address, date of birth, related people and NHS number.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="pdsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable PDS Integration</FormLabel>
                          <FormDescription>
                            Allow this tenant to access NHS patient demographics.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pdsApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDS API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PDS API key" {...field} value={field.value || ""} type="password" />
                        </FormControl>
                        <FormDescription>
                          This is the NHS Digital issued API key for accessing the PDS service.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTestConnection("pds")}
                    disabled={!form.watch("pdsApiKey") || testConnectionMutation.isPending}
                  >
                    {testConnectionMutation.isPending && testConnectionMutation.variables === "pds" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="scr" className="space-y-4 p-4 border rounded-md mt-4">
                  <div>
                    <h3 className="text-lg font-medium">Summary Care Record (SCR)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      National database of summary-level care information such as medications and allergies.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="scrEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable SCR Integration</FormLabel>
                          <FormDescription>
                            Allow this tenant to access Summary Care Records.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scrApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SCR API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SCR API key" {...field} value={field.value || ""} type="password" />
                        </FormControl>
                        <FormDescription>
                          This is the NHS Digital issued API key for accessing the SCR service.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTestConnection("scr")}
                    disabled={!form.watch("scrApiKey") || testConnectionMutation.isPending}
                  >
                    {testConnectionMutation.isPending && testConnectionMutation.variables === "scr" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="eps" className="space-y-4 p-4 border rounded-md mt-4">
                  <div>
                    <h3 className="text-lg font-medium">Electronic Prescription Service (EPS)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sends prescriptions from prescribers such as GP practices to dispensers such as pharmacies.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="epsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable EPS Integration</FormLabel>
                          <FormDescription>
                            Allow this tenant to create and manage electronic prescriptions.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="epsApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EPS API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter EPS API key" {...field} value={field.value || ""} type="password" />
                        </FormControl>
                        <FormDescription>
                          This is the NHS Digital issued API key for accessing the EPS service.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTestConnection("eps")}
                    disabled={!form.watch("epsApiKey") || testConnectionMutation.isPending}
                  >
                    {testConnectionMutation.isPending && testConnectionMutation.variables === "eps" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="ers" className="space-y-4 p-4 border rounded-md mt-4">
                  <div>
                    <h3 className="text-lg font-medium">e-Referral Service (e-RS)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Provides an easy way for patients to choose their first hospital or clinic appointment with a specialist.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="eRsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable e-RS Integration</FormLabel>
                          <FormDescription>
                            Allow this tenant to create and manage electronic referrals.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eRsApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>e-RS API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter e-RS API key" {...field} value={field.value || ""} type="password" />
                        </FormControl>
                        <FormDescription>
                          This is the NHS Digital issued API key for accessing the e-RS service.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTestConnection("ers")}
                    disabled={!form.watch("eRsApiKey") || testConnectionMutation.isPending}
                  >
                    {testConnectionMutation.isPending && testConnectionMutation.variables === "ers" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="gpconnect" className="space-y-4 p-4 border rounded-md mt-4">
                  <div>
                    <h3 className="text-lg font-medium">GP Connect</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allows applications to access detailed medical records from a patient's GP system.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="gpConnectEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable GP Connect Integration</FormLabel>
                          <FormDescription>
                            Allow this tenant to access detailed GP records.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gpConnectApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GP Connect API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter GP Connect API key" {...field} value={field.value || ""} type="password" />
                        </FormControl>
                        <FormDescription>
                          This is the NHS Digital issued API key for accessing the GP Connect service.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTestConnection("gpconnect")}
                    disabled={!form.watch("gpConnectApiKey") || testConnectionMutation.isPending}
                  >
                    {testConnectionMutation.isPending && testConnectionMutation.variables === "gpconnect" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save NHS Digital Settings"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
