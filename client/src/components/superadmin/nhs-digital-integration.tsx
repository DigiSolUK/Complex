import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Check, X, RefreshCw } from "lucide-react";

// Form validation schema
const nhsIntegrationSchema = z.object({
  pdsApiKey: z.string().min(1, "PDS API key is required").or(z.literal("")).optional(),
  scrApiKey: z.string().min(1, "SCR API key is required").or(z.literal("")).optional(),
  epsApiKey: z.string().min(1, "EPS API key is required").or(z.literal("")).optional(),
  eReferralApiKey: z.string().min(1, "e-Referral API key is required").or(z.literal("")).optional(),
  gpConnectApiKey: z.string().min(1, "GP Connect API key is required").or(z.literal("")).optional(),
  pdsEnabled: z.boolean().default(false),
  scrEnabled: z.boolean().default(false),
  epsEnabled: z.boolean().default(false),
  eReferralEnabled: z.boolean().default(false),
  gpConnectEnabled: z.boolean().default(false),
});

// Form values type
type NhsIntegrationFormValues = z.infer<typeof nhsIntegrationSchema>;

// Component props
export interface NhsDigitalIntegrationProps {
  tenantId: number;
}

// Main component
export function NhsDigitalIntegration({ tenantId }: NhsDigitalIntegrationProps) {
  const { toast } = useToast();
  const [testingService, setTestingService] = useState<string | null>(null);

  // Fetch existing integration settings
  const { data: integration, isLoading } = useQuery({
    queryKey: [`/api/superadmin/tenants/${tenantId}/nhs-integration`],
    enabled: !!tenantId,
  });

  // Form definition
  const form = useForm<NhsIntegrationFormValues>({
    resolver: zodResolver(nhsIntegrationSchema),
    defaultValues: {
      pdsApiKey: "",
      scrApiKey: "",
      epsApiKey: "",
      eReferralApiKey: "",
      gpConnectApiKey: "",
      pdsEnabled: false,
      scrEnabled: false,
      epsEnabled: false,
      eReferralEnabled: false,
      gpConnectEnabled: false,
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (integration) {
      form.reset({
        pdsApiKey: integration.pdsApiKey === "••••••••" ? "" : integration.pdsApiKey || "", 
        scrApiKey: integration.scrApiKey === "••••••••" ? "" : integration.scrApiKey || "",
        epsApiKey: integration.epsApiKey === "••••••••" ? "" : integration.epsApiKey || "",
        eReferralApiKey: integration.eReferralApiKey === "••••••••" ? "" : integration.eReferralApiKey || "",
        gpConnectApiKey: integration.gpConnectApiKey === "••••••••" ? "" : integration.gpConnectApiKey || "",
        pdsEnabled: integration.pdsEnabled || false,
        scrEnabled: integration.scrEnabled || false,
        epsEnabled: integration.epsEnabled || false,
        eReferralEnabled: integration.eReferralEnabled || false,
        gpConnectEnabled: integration.gpConnectEnabled || false,
      });
    }
  }, [integration, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (values: NhsIntegrationFormValues) => {
      // Preserve existing API keys if they're masked
      if (integration) {
        if (!values.pdsApiKey && integration.pdsApiKey === "••••••••") {
          values.pdsApiKey = "__UNCHANGED__";
        }
        if (!values.scrApiKey && integration.scrApiKey === "••••••••") {
          values.scrApiKey = "__UNCHANGED__";
        }
        if (!values.epsApiKey && integration.epsApiKey === "••••••••") {
          values.epsApiKey = "__UNCHANGED__";
        }
        if (!values.eReferralApiKey && integration.eReferralApiKey === "••••••••") {
          values.eReferralApiKey = "__UNCHANGED__";
        }
        if (!values.gpConnectApiKey && integration.gpConnectApiKey === "••••••••") {
          values.gpConnectApiKey = "__UNCHANGED__";
        }
      }
      
      const res = await apiRequest(
        "POST",
        `/api/superadmin/tenants/${tenantId}/nhs-integration`,
        values
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "NHS Digital Integration Settings Saved",
        description: "The integration settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/superadmin/tenants/${tenantId}/nhs-integration`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Save Settings",
        description: error.message || "An error occurred while saving the integration settings.",
        variant: "destructive",
      });
    },
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (service: string) => {
      const res = await apiRequest(
        "POST",
        `/api/superadmin/tenants/${tenantId}/nhs-integration/test`,
        { service }
      );
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Test Successful",
        description: data.message || "Successfully connected to the NHS Digital service.",
      });
      setTestingService(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Failed to connect to the NHS Digital service.",
        variant: "destructive",
      });
      setTestingService(null);
    },
  });

  // Handle form submission
  const onSubmit = (values: NhsIntegrationFormValues) => {
    saveMutation.mutate(values);
  };

  // Handle test connection
  const testConnection = (service: string) => {
    setTestingService(service);
    testConnectionMutation.mutate(service);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NHS Digital Integration</CardTitle>
          <CardDescription>Loading integration settings...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NHS Digital Integration</CardTitle>
        <CardDescription>
          Configure connections to NHS Digital services. Enable or disable individual services and provide API keys.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* PDS - Personal Demographics Service */}
              <div className="grid gap-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Personal Demographics Service (PDS)</h3>
                    <p className="text-sm text-muted-foreground">
                      Access patient demographic information such as name, address, and NHS number.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="pdsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {field.value ? "Enabled" : "Disabled"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="pdsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={integration?.pdsApiKey === "••••••••" ? "••••••••" : "Enter PDS API key"}
                          disabled={!form.watch("pdsEnabled")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!form.watch("pdsEnabled") || !integration?.pdsApiKey || testingService !== null}
                    onClick={() => testConnection("pds")}
                  >
                    {testingService === "pds" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* SCR - Summary Care Record */}
              <div className="grid gap-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Summary Care Record (SCR)</h3>
                    <p className="text-sm text-muted-foreground">
                      Access patient's clinical summary including allergies, medications, and adverse reactions.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="scrEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {field.value ? "Enabled" : "Disabled"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="scrApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={integration?.scrApiKey === "••••••••" ? "••••••••" : "Enter SCR API key"}
                          disabled={!form.watch("scrEnabled")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!form.watch("scrEnabled") || !integration?.scrApiKey || testingService !== null}
                    onClick={() => testConnection("scr")}
                  >
                    {testingService === "scr" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* EPS - Electronic Prescription Service */}
              <div className="grid gap-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Electronic Prescription Service (EPS)</h3>
                    <p className="text-sm text-muted-foreground">
                      Send electronic prescriptions directly to pharmacies and manage medication dispensing.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="epsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {field.value ? "Enabled" : "Disabled"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="epsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={integration?.epsApiKey === "••••••••" ? "••••••••" : "Enter EPS API key"}
                          disabled={!form.watch("epsEnabled")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!form.watch("epsEnabled") || !integration?.epsApiKey || testingService !== null}
                    onClick={() => testConnection("eps")}
                  >
                    {testingService === "eps" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* e-Referral Service */}
              <div className="grid gap-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">e-Referral Service (e-RS)</h3>
                    <p className="text-sm text-muted-foreground">
                      Make and manage patient referrals to other healthcare providers within the NHS network.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="eReferralEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {field.value ? "Enabled" : "Disabled"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="eReferralApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={integration?.eReferralApiKey === "••••••••" ? "••••••••" : "Enter e-Referral API key"}
                          disabled={!form.watch("eReferralEnabled")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!form.watch("eReferralEnabled") || !integration?.eReferralApiKey || testingService !== null}
                    onClick={() => testConnection("e-referral")}
                  >
                    {testingService === "e-referral" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* GP Connect */}
              <div className="grid gap-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">GP Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      Access GP practice data including appointments, patient records, and structured medical data.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="gpConnectEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {field.value ? "Enabled" : "Disabled"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="gpConnectApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={integration?.gpConnectApiKey === "••••••••" ? "••••••••" : "Enter GP Connect API key"}
                          disabled={!form.watch("gpConnectEnabled")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!form.watch("gpConnectEnabled") || !integration?.gpConnectApiKey || testingService !== null}
                    onClick={() => testConnection("gp-connect")}
                  >
                    {testingService === "gp-connect" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-between px-0">
              <div>
                {integration && integration.lastVerified && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Last verified:</span> {new Date(integration.lastVerified).toLocaleString()}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="ml-auto"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Settings</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}