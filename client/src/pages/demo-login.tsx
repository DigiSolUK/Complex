import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";
import { useState } from "react";
import { Lock, User } from "lucide-react";

export default function DemoLogin() {
  const { toast } = useToast();
  const { loginDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    try {
      await loginDemo(role);
      toast({
        title: "Welcome to Demo Mode",
        description: `You're now using ComplexCare CRM in demo mode as ${role === 'admin' ? 'an Administrator' : 'a Care Staff member'}.`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Demo Login Failed",
        description: "Could not start demo session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-4xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">ComplexCare CRM</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Healthcare CRM system for complex patient management
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Comprehensive Patient Management</h3>
                <p className="text-sm text-muted-foreground">Streamline patient data management with integrations to healthcare systems.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Secure and Compliant</h3>
                <p className="text-sm text-muted-foreground">Meeting healthcare regulations with advanced security protections.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 md:order-2">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Demo Login</CardTitle>
              <CardDescription>
                Try ComplexCare CRM with a demo account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p>Select a demo role to explore the system:</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                onClick={() => handleDemoLogin("admin")} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Please wait...
                  </div>
                ) : (
                  "Login as Administrator"
                )}
              </Button>
              <Button 
                onClick={() => handleDemoLogin("care_staff")} 
                variant="outline" 
                disabled={isLoading} 
                className="w-full"
              >
                Login as Care Staff
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
