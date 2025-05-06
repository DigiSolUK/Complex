import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import PayrollMenu from '@/components/payroll/payroll-menu';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function PayrollPage() {
  const { user } = useAuth();
  
  // Check if user has necessary permissions
  const hasPayrollAccess = user?.role === 'admin' || user?.role === 'superadmin';

  if (!hasPayrollAccess) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <PageHeader
          heading="Payroll Management"
          description="Export and manage payroll data"
        />
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            You do not have permission to access the payroll management system. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        heading="Payroll Management"
        description="Export and manage payroll data"
      />
      <PayrollMenu />
    </div>
  );
}
