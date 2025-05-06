import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Tenant, InsertTenant } from "@shared/schema";

const tenantFormSchema = z.object({
  name: z.string().min(3, { message: "Tenant name must be at least 3 characters" }),
  domain: z.string().min(3, { message: "Domain must be at least 3 characters" }),
  status: z.enum(["active", "inactive", "suspended", "trial"]),
  subscriptionTier: z.enum(["standard", "professional", "enterprise"]),
  userLimit: z.coerce.number().min(1, { message: "User limit must be at least 1" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactName: z.string().min(3, { message: "Contact name is required" }),
  contactPhone: z.string().optional(),
  billingInfo: z.string().optional(),
});

export default function TenantManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof tenantFormSchema>>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      status: "active",
      subscriptionTier: "standard",
      userLimit: 10,
      contactEmail: "",
      contactName: "",
      contactPhone: "",
      billingInfo: "",
    },
  });

  // Fetch tenants data
  const { data: tenants = [], isLoading, error } = useQuery<Tenant[]>({
    queryKey: ["/api/superadmin/tenants"]
  });

  // Create tenant mutation
  const createTenantMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tenantFormSchema>) => {
      const response = await apiRequest("POST", "/api/superadmin/tenants", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/tenants"] });
      form.reset();
      setIsCreateDialogOpen(false);
      toast({
        title: "Tenant created",
        description: "The tenant has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter tenants by search query
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: z.infer<typeof tenantFormSchema>) => {
    createTenantMutation.mutate(data);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      case "trial":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return "default";
      case "professional":
        return "outline";
      case "standard":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading tenants...</div>;
  }
  
  if (error) {
    return <div className="p-8">Error loading tenants</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">Create and manage tenant organizations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Add a new tenant organization to the system. Fill in the required fields below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="HealthCare Inc." {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the tenant organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="healthcare" {...field} />
                      </FormControl>
                      <FormDescription>
                        The subdomain identifier for this tenant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subscriptionTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Tier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="userLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of users allowed for this tenant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Information (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Billing details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit"
                    disabled={createTenantMutation.isPending}
                  >
                    {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1 text-lg font-medium">
                  {tenant.name}
                </CardTitle>
                <StatusBadge variant={getStatusBadgeVariant(tenant.status)} className="capitalize">
                  {tenant.status}
                </StatusBadge>
              </div>
              <CardDescription className="line-clamp-1 mt-1">
                {tenant.domain}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Subscription</dt>
                  <dd className="font-medium">
                    <StatusBadge variant={getTierBadgeVariant(tenant.subscriptionTier)} className="capitalize">
                      {tenant.subscriptionTier}
                    </StatusBadge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">User Limit</dt>
                  <dd className="font-medium">{tenant.userLimit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="font-medium line-clamp-1">{tenant.contactName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium line-clamp-1">{tenant.contactEmail}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="border-t bg-muted/40 p-4">
              <div className="flex space-x-2">
                <Link href={`/superadmin/tenants/${tenant.id}`}>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </Link>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                {tenant.status !== "suspended" ? (
                  <Button size="sm" variant="ghost" className="text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" className="text-green-600">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No tenants found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {searchQuery ? "No tenants match your search criteria" : "Start by adding a new tenant"}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
          )}
        </div>
      )}
    </div>
  );
}
