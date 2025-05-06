import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { apiRequest } from '@/lib/query-client';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Calendar as CalendarIcon, Check, Cloud, Download, FileSpreadsheet, FileText, Filter, HelpCircle, Info, Loader2, RefreshCw, Settings, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AnimatedCard } from '@/components/ui/animated-card';

const PAYROLL_PERIODS = [
  { id: 'weekly', name: 'Weekly', frequency: 52, description: 'Employees are paid every week' },
  { id: 'biweekly', name: 'Bi-Weekly', frequency: 26, description: 'Employees are paid every two weeks' },
  { id: 'semimonthly', name: 'Semi-Monthly', frequency: 24, description: 'Employees are paid twice per month' },
  { id: 'monthly', name: 'Monthly', frequency: 12, description: 'Employees are paid once per month' },
];

const PAYMENT_PROVIDERS = [
  { id: 'nhs-sbs', name: 'NHS Shared Business Services (SBS)', formats: ['xls', 'csv', 'json', 'api'] },
  { id: 'sage', name: 'Sage Payroll', formats: ['xls', 'csv', 'api'] },
  { id: 'xero', name: 'Xero', formats: ['csv', 'api'] },
  { id: 'quickbooks', name: 'QuickBooks', formats: ['iif', 'csv', 'api'] },
  { id: 'iris', name: 'IRIS Payroll', formats: ['csv', 'api'] },
  { id: 'other', name: 'Other Provider', formats: ['csv', 'xls', 'json', 'api'] },
];

const PAYROLL_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  EXPORTED: 'exported',
  PAID: 'paid',
  REJECTED: 'rejected'
};

// Mock data for payroll periods
const PAYMENT_HISTORY = [
  { 
    id: 'PR-2025-05-01', 
    period: 'May 2025 (Week 1)', 
    date: '2025-05-01', 
    staff: 24, 
    total: 45720.50, 
    status: PAYROLL_STATUS.PAID,
    provider: 'NHS Shared Business Services (SBS)',
    format: 'api'
  },
  { 
    id: 'PR-2025-04-24', 
    period: 'April 2025 (Week 4)', 
    date: '2025-04-24', 
    staff: 23, 
    total: 43850.75, 
    status: PAYROLL_STATUS.PAID,
    provider: 'NHS Shared Business Services (SBS)',
    format: 'api'
  },
  { 
    id: 'PR-2025-04-17', 
    period: 'April 2025 (Week 3)', 
    date: '2025-04-17', 
    staff: 24, 
    total: 45210.25, 
    status: PAYROLL_STATUS.PAID,
    provider: 'NHS Shared Business Services (SBS)',
    format: 'api'
  },
  { 
    id: 'PR-2025-04-10', 
    period: 'April 2025 (Week 2)', 
    date: '2025-04-10', 
    staff: 22, 
    total: 42100.00, 
    status: PAYROLL_STATUS.PAID,
    provider: 'NHS Shared Business Services (SBS)',
    format: 'api'
  },
  { 
    id: 'PR-2025-04-03', 
    period: 'April 2025 (Week 1)', 
    date: '2025-04-03', 
    staff: 23, 
    total: 43500.75, 
    status: PAYROLL_STATUS.PAID,
    provider: 'NHS Shared Business Services (SBS)',
    format: 'xls'
  },
];

type TimeSheet = {
  id: string;
  careProfessionalName: string;
  careProfessionalId: string;
  period: string;
  hours: number;
  regularHours: number;
  overtimeHours: number;
  rate: number;
  totalAmount: number;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
};

// Sample timesheet data for the current period
const CURRENT_TIMESHEETS: TimeSheet[] = [
  { 
    id: 'TS-2025-05-01-001', 
    careProfessionalName: 'Sarah Johnson', 
    careProfessionalId: 'CP001', 
    period: 'May 2025 (Week 1)', 
    hours: 38, 
    regularHours: 37.5, 
    overtimeHours: 0.5, 
    rate: 25.50, 
    totalAmount: 975.38, 
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-05-01T14:30:00Z'
  },
  { 
    id: 'TS-2025-05-01-002', 
    careProfessionalName: 'Michael Chen', 
    careProfessionalId: 'CP015', 
    period: 'May 2025 (Week 1)', 
    hours: 40, 
    regularHours: 37.5, 
    overtimeHours: 2.5, 
    rate: 27.00, 
    totalAmount: 1080.00, 
    status: 'approved',
    approvedBy: 'Dr. Emma Thompson',
    approvedAt: '2025-05-01T15:45:00Z'
  },
  { 
    id: 'TS-2025-05-01-003', 
    careProfessionalName: 'Jessica Smith', 
    careProfessionalId: 'CP008', 
    period: 'May 2025 (Week 1)', 
    hours: 35, 
    regularHours: 35, 
    overtimeHours: 0, 
    rate: 26.25, 
    totalAmount: 918.75, 
    status: 'pending'
  },
  { 
    id: 'TS-2025-05-01-004', 
    careProfessionalName: 'Daniel Williams', 
    careProfessionalId: 'CP023', 
    period: 'May 2025 (Week 1)', 
    hours: 42, 
    regularHours: 37.5, 
    overtimeHours: 4.5, 
    rate: 24.75, 
    totalAmount: 1050.94, 
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-05-01T16:20:00Z',
    notes: 'Covered for staff shortage on weekend'
  },
  { 
    id: 'TS-2025-05-01-005', 
    careProfessionalName: 'Emily Parker', 
    careProfessionalId: 'CP042', 
    period: 'May 2025 (Week 1)', 
    hours: 36, 
    regularHours: 36, 
    overtimeHours: 0, 
    rate: 23.50, 
    totalAmount: 846.00, 
    status: 'rejected',
    approvedBy: 'Dr. Emma Thompson',
    approvedAt: '2025-05-01T11:15:00Z',
    notes: 'Hours do not match patient visit records, please review and resubmit'
  },
];

export default function PayrollMenu() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [exportFormat, setExportFormat] = useState<string>('api');
  const [payrollProvider, setPayrollProvider] = useState<string>('nhs-sbs');
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);
  
  // Function to handle approving timesheets
  const handleApproveTimesheets = () => {
    if (selectedTimesheets.length === 0) {
      toast({
        title: 'No timesheets selected',
        description: 'Please select at least one timesheet to approve.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Timesheets Approved',
        description: `Successfully approved ${selectedTimesheets.length} timesheet(s).`,
        className: "bg-green-600 text-white",
      });
      setSelectedTimesheets([]);
    }, 1500);
  };
  
  // Function to handle export of payroll data
  const handleExportPayroll = () => {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === payrollProvider);
    
    if (!provider) {
      toast({
        title: 'Provider Not Selected',
        description: 'Please select a valid payroll provider.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!provider.formats.includes(exportFormat)) {
      toast({
        title: 'Format Not Supported',
        description: `${provider.name} does not support ${exportFormat.toUpperCase()} format.`,
        variant: 'destructive',
      });
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: 'Export Successful',
        description: `Payroll data exported in ${exportFormat.toUpperCase()} format for ${provider.name}.`,
      });
    }, 2000);
  };
  
  // Function to handle toggling a timesheet selection
  const toggleTimesheet = (id: string) => {
    setSelectedTimesheets(prev => 
      prev.includes(id) ? prev.filter(tsId => tsId !== id) : [...prev, id]
    );
  };
  
  // Function to format a status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case PAYROLL_STATUS.PAID:
        return <Badge className="bg-green-600">Paid</Badge>;
      case PAYROLL_STATUS.EXPORTED:
        return <Badge className="bg-blue-600">Exported</Badge>;
      case PAYROLL_STATUS.APPROVED:
        return <Badge className="bg-green-500">Approved</Badge>;
      case PAYROLL_STATUS.PROCESSING:
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case PAYROLL_STATUS.PENDING:
        return <Badge variant="outline">Pending</Badge>;
      case PAYROLL_STATUS.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };
  
  // Generate payroll period name
  const getPayrollPeriodName = (period: any) => {
    if (!date) return 'Select a date';
    
    const month = format(date, 'MMMM yyyy');
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    
    return `${month} (Week ${weekOfMonth})`;
  };
  
  // Calculate selected timesheet totals
  const getSelectedTimesheetsTotal = () => {
    return CURRENT_TIMESHEETS
      .filter(ts => selectedTimesheets.includes(ts.id))
      .reduce((sum, ts) => sum + ts.totalAmount, 0);
  };
  
  // Find the current provider
  const currentProvider = PAYMENT_PROVIDERS.find(provider => provider.id === payrollProvider);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Export Settings</TabsTrigger>
        </TabsList>
        
        {/* Current Period Tab */}
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Current Payroll Period</CardTitle>
                  <CardDescription>
                    {date ? format(date, 'dd MMMM yyyy') : 'Select a payroll period'}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {date ? format(date, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Select
                    value={payrollProvider}
                    onValueChange={setPayrollProvider}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Filter timesheets..."
                      className="w-full md:w-[300px] lg:w-[400px]"
                    />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleApproveTimesheets}
                      disabled={selectedTimesheets.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Approve Selected
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleExportPayroll}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Export Payroll
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedTimesheets.length === CURRENT_TIMESHEETS.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTimesheets(CURRENT_TIMESHEETS.map(ts => ts.id));
                              } else {
                                setSelectedTimesheets([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Professional</TableHead>
                        <TableHead className="hidden md:table-cell">ID</TableHead>
                        <TableHead className="text-right">Hours</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CURRENT_TIMESHEETS.map((timesheet) => (
                        <TableRow key={timesheet.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTimesheets.includes(timesheet.id)}
                              onCheckedChange={() => toggleTimesheet(timesheet.id)}
                              disabled={timesheet.status === 'rejected'}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{timesheet.careProfessionalName}</TableCell>
                          <TableCell className="hidden md:table-cell">{timesheet.careProfessionalId}</TableCell>
                          <TableCell className="text-right">
                            {timesheet.hours}
                            {timesheet.overtimeHours > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (+{timesheet.overtimeHours} OT)
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            £{timesheet.rate.toFixed(2)}/hr
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(timesheet.totalAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(timesheet.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">
                      Selected: {selectedTimesheets.length} of {CURRENT_TIMESHEETS.length} timesheets
                    </div>
                    <div className="text-lg font-semibold">
                      Total: {formatCurrency(getSelectedTimesheetsTotal())}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                {currentProvider ? (
                  <span className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Export provider: {currentProvider.name}
                  </span>
                ) : 'No provider selected'}
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View and download past payroll records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search payments..."
                      className="w-full md:w-[300px] lg:w-[400px]"
                    />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="exported">Exported</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Staff</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Provider</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PAYMENT_HISTORY.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.period}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(payment.date), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right">{payment.staff}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.total)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-center">
                            <Badge variant="outline" className="font-normal">
                              {payment.format.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Export Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Export Settings</CardTitle>
              <CardDescription>
                Configure payroll export preferences and providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll Periods</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {PAYROLL_PERIODS.map((period) => (
                      <div key={period.id} className="border rounded-md p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{period.name}</h4>
                          <Badge variant="outline">{period.frequency}x/year</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{period.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Format</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div
                      className={cn(
                        "border rounded-md p-4 space-y-2 cursor-pointer hover:border-primary transition-colors",
                        exportFormat === 'xls' && "border-primary bg-primary/5"
                      )}
                      onClick={() => setExportFormat('xls')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Excel (.xls)
                        </h4>
                        {exportFormat === 'xls' && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">Microsoft Excel spreadsheet format</p>
                    </div>
                    
                    <div
                      className={cn(
                        "border rounded-md p-4 space-y-2 cursor-pointer hover:border-primary transition-colors",
                        exportFormat === 'csv' && "border-primary bg-primary/5"
                      )}
                      onClick={() => setExportFormat('csv')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          CSV (.csv)
                        </h4>
                        {exportFormat === 'csv' && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">Comma-separated values format</p>
                    </div>
                    
                    <div
                      className={cn(
                        "border rounded-md p-4 space-y-2 cursor-pointer hover:border-primary transition-colors",
                        exportFormat === 'json' && "border-primary bg-primary/5"
                      )}
                      onClick={() => setExportFormat('json')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          JSON (.json)
                        </h4>
                        {exportFormat === 'json' && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">JavaScript Object Notation format</p>
                    </div>
                    
                    <div
                      className={cn(
                        "border rounded-md p-4 space-y-2 cursor-pointer hover:border-primary transition-colors",
                        exportFormat === 'api' && "border-primary bg-primary/5"
                      )}
                      onClick={() => setExportFormat('api')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Cloud className="h-4 w-4 mr-2" />
                          API Integration
                        </h4>
                        {exportFormat === 'api' && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">Direct API integration with provider</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll Provider Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="payroll-provider">Provider</Label>
                      <Select
                        value={payrollProvider}
                        onValueChange={setPayrollProvider}
                      >
                        <SelectTrigger id="payroll-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_PROVIDERS.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="export-format">Export Format</Label>
                      <Select
                        value={exportFormat}
                        onValueChange={setExportFormat}
                      >
                        <SelectTrigger id="export-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentProvider?.formats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format === 'xls' ? 'Excel (.xls)' :
                               format === 'csv' ? 'CSV (.csv)' :
                               format === 'json' ? 'JSON (.json)' :
                               format === 'api' ? 'API Integration' :
                               format.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {exportFormat === 'api' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>API Configuration Required</AlertTitle>
                      <AlertDescription>
                        Direct API integration requires additional setup in the API Integrations settings.
                        <Button variant="link" className="p-0 h-auto font-normal" asChild>
                          <a href="/settings">Configure API Integrations</a>
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                onClick={() => {
                  toast({
                    title: 'Settings Saved',
                    description: 'Your payroll export settings have been updated.',
                    className: "bg-green-600 text-white",
                  });
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-3">
        <AnimatedCard header={<h3 className="text-md font-medium">Payroll Summary</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Current period statistics and totals
            </p>
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Staff</span>
                <span className="font-medium">{CURRENT_TIMESHEETS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Hours</span>
                <span className="font-medium">
                  {CURRENT_TIMESHEETS.reduce((sum, ts) => sum + ts.hours, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Amount</span>
                <span className="font-medium">
                  {formatCurrency(CURRENT_TIMESHEETS.reduce((sum, ts) => sum + ts.totalAmount, 0))}
                </span>
              </div>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard header={<h3 className="text-md font-medium">Approval Status</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Timesheet approval status breakdown
            </p>
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <Badge className="mr-2 bg-green-500 h-2 w-2 rounded-full p-0" />
                  Approved
                </span>
                <span className="font-medium">
                  {CURRENT_TIMESHEETS.filter(ts => ts.status === 'approved').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <Badge className="mr-2 bg-gray-500 h-2 w-2 rounded-full p-0" />
                  Pending
                </span>
                <span className="font-medium">
                  {CURRENT_TIMESHEETS.filter(ts => ts.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <Badge className="mr-2 bg-red-500 h-2 w-2 rounded-full p-0" />
                  Rejected
                </span>
                <span className="font-medium">
                  {CURRENT_TIMESHEETS.filter(ts => ts.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard header={<h3 className="text-md font-medium">Quick Actions</h3>} hoverEffect="gentle-lift">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Frequently used payroll actions
            </p>
            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/timesheets">
                  <Check className="h-4 w-4 mr-2" />
                  Review Timesheets
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Timesheet Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Configure Tax Settings
              </Button>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      <Alert className="mt-4">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Payroll Integration Support</AlertTitle>
        <AlertDescription>
          If you need assistance with payroll integrations, please contact our support team at <span className="font-medium">payroll@complexcare.com</span> or refer to the documentation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
