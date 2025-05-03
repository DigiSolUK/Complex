import React, { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function Login() {
  const [, navigate] = useLocation();
  const { login, enterDemoMode, error, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    try {
      await login(data.username, data.password);
      
      // Check the user role after login and redirect accordingly
      if (isSuperAdmin) {
        navigate("/superadmin/dashboard");
      } else if (isAdmin) {
        navigate("/superadmin/dashboard"); // Admins also see the admin dashboard
      } else {
        navigate("/dashboard"); // Regular users go to the main dashboard
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async function handleDemoMode() {
    setDemoLoading(true);
    try {
      await enterDemoMode();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error entering demo mode:", error);
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-700">ComplexCare CRM</h1>
          <p className="text-neutral-500 mt-2">Healthcare Management System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          disabled={isLoading || demoLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          disabled={isLoading || demoLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || demoLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 flex items-center">
              <div className="flex-grow h-px bg-neutral-200"></div>
              <span className="px-3 text-sm text-neutral-500">OR</span>
              <div className="flex-grow h-px bg-neutral-200"></div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleDemoMode}
              disabled={isLoading || demoLoading}
            >
              {demoLoading ? "Loading Demo..." : "Enter Demo Mode"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="bg-yellow-50 p-3 rounded-md flex items-start text-sm">
              <InfoIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Demo Mode</p>
                <p className="text-yellow-700 mt-1">
                  No authentication required. Access the system with sample data
                  for evaluation purposes.
                </p>
              </div>
            </div>
            <div className="text-center text-sm text-neutral-500 w-full">
              <p>Need help? Contact support@complexcare.dev</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
