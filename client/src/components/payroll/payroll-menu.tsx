import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
  FileSpreadsheet,
  FileText,
  File,
  ExternalLink,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  ChevronDown,
  Check
} from 'lucide-react';

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

type ExportFormat = 'xls' | 'csv' | 'json' | 'api';
type PayrollPeriod = 'weekly' | 'biweekly' | 'monthly';
type PayrollStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function PayrollMenu() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod>('monthly');
  const [statusFilter, setStatusFilter] = useState<PayrollStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch timesheets
  const { data: timesheets, isLoading } = useQuery({
    queryKey: ["/api/payroll/timesheets", selectedPeriod, statusFilter],
    refetchOnWindowFocus: false,
  });

  // For bulk selection
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Mutation for approving timesheets
  const approvalMutation = useMutation({
    mutationFn: async ({ ids, action }: { ids: string[], action: 'approve' | 'reject' }) => {
      const response = await apiRequest('POST', `/api/payroll/timesheets/${action}`, { ids });
      return response.json();
    },
    onSuccess: (data, variables) => {
      const action = variables.action;
      const count = variables.ids.length;
      toast({
        title: `Timesheets ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Successfully ${action === 'approve' ? 'approved' : 'rejected'} ${count} timesheet${count !== 1 ? 's' : ''}.`,
        className: action === 'approve' ? "bg-green-600 text-white" : undefined,
        variant: action === 'reject' ? 'destructive' : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/timesheets"] });
      setSelectedTimesheets([]);
      setSelectAll(false);
    },
    onError: (error) => {
      toast({
        title: 'Error processing timesheets',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for exporting timesheets
  const exportMutation = useMutation({
    mutationFn: async ({ ids, format }: { ids: string[], format: ExportFormat }) => {
      const response = await apiRequest('POST', `/api/payroll/export/${format}`, { ids });
      return format === 'api' ? response.json() : response.blob();
    },
    onSuccess: (data, variables) => {
      const { format, ids } = variables;
      
      if (format === 'api') {
        toast({
          title: 'API Export Successful',
          description: `Data was successfully sent to the payroll API for ${ids.length} timesheet${ids.length !== 1 ? 's' : ''}.`,
          className: "bg-green-600 text-white",
        });
        return;
      }
      
      // For file downloads
      const blob = data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `payroll-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Export Successful',
        description: `Successfully exported ${ids.length} timesheet${ids.length !== 1 ? 's' : ''} to ${format.toUpperCase()} format.`,
        className: "bg-green-600 text-white",
      });
    },
    onError: (error) => {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle bulk actions
  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedTimesheets.length === 0) {
      toast({
        title: 'No timesheets selected',
        description: 'Please select at least one timesheet.',
        variant: 'destructive',
      });
      return;
    }
    
    approvalMutation.mutate({ ids: selectedTimesheets, action });
  };

  // Handle export
  const handleExport = (format: ExportFormat) => {
    if (selectedTimesheets.length === 0) {
      toast({
        title: 'No timesheets selected',
        description: 'Please select at least one timesheet for export.',
        variant: 'destructive',
      });
      return;
    }
    
    exportMutation.mutate({ ids: selectedTimesheets, format });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    setSelectedTimesheets(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTimesheets([]);
    } else {
      // Select all visible/filtered timesheets
      const visibleTimesheets = filteredTimesheets?.map(ts => ts.id) || [];
      setSelectedTimesheets(visibleTimesheets);
    }
    setSelectAll(!selectAll);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />{status}</Badge>;
    }
  };

  // Filter timesheets based on search and status
  const filteredTimesheets = React.useMemo(() => {
    if (!timesheets) return [];
    
    return (timesheets as TimeSheet[]).filter(timesheet => {
      // Status filter
      if (statusFilter !== 'all' && timesheet.status.toLowerCase() !== statusFilter) {
        return false;
      }
      
      // Search query filter (case insensitive)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          timesheet.careProfessionalName.toLowerCase().includes(query) ||
          timesheet.careProfessionalId.toLowerCase().includes(query) ||
          timesheet.period.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [timesheets, statusFilter, searchQuery]);

  // Calculate totals for summary
  const calculateSummary = () => {
    if (!filteredTimesheets.length) {
      return {
        totalHours: 0,
        totalRegularHours: 0,
        totalOvertimeHours: 0,
        totalAmount: 0,
        staffCount: 0,
        avgHoursPerStaff: 0,
      };
    }
    
    const totalHours = filteredTimesheets.reduce((sum, ts) => sum + ts.hours, 0);
    const totalRegularHours = filteredTimesheets.reduce((sum, ts) => sum + ts.regularHours, 0);
    const totalOvertimeHours = filteredTimesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);
    const totalAmount = filteredTimesheets.reduce((sum, ts) => sum + ts.totalAmount, 0);
    const staffCount = new Set(filteredTimesheets.map(ts => ts.careProfessionalId)).size;
    
    return {
      totalHours,
      totalRegularHours,
      totalOvertimeHours,
      totalAmount,
      staffCount,
      avgHoursPerStaff: staffCount ? +(totalHours / staffCount).toFixed(1) : 0,
    };
  };
  
  const summary = calculateSummary();

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Management</CardTitle>
          <CardDescription>Loading timesheet data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-10">
            <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>Manage and approve timesheets for your care professionals</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PayrollPeriod)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timesheets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
              <TabsTrigger value="summary">Summary & Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timesheets" className="space-y-4 pt-4">
              {/* Filters and search */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search staff or period..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PayrollStatus)}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTimesheets.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600" 
                        onClick={() => handleBulkAction('approve')}
                        disabled={approvalMutation.isPending}
                      >
                        {approvalMutation.isPending ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Approve Selected
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => handleBulkAction('reject')}
                        disabled={approvalMutation.isPending}
                      >
                        {approvalMutation.isPending ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject Selected
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52" align="end">
                          <div className="grid gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="justify-start" 
                              onClick={() => handleExport('xls')}
                              disabled={exportMutation.isPending}
                            >
                              <FileSpreadsheet className="mr-2 h-4 w-4" />
                              Excel (.xls)
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="justify-start" 
                              onClick={() => handleExport('csv')}
                              disabled={exportMutation.isPending}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              CSV (.csv)
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="justify-start" 
                              onClick={() => handleExport('json')}
                              disabled={exportMutation.isPending}
                            >
                              <File className="mr-2 h-4 w-4" />
                              JSON (.json)
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="justify-start" 
                              onClick={() => handleExport('api')}
                              disabled={exportMutation.isPending}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Send to Payroll API
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                </div>
              </div>
              
              {/* Timesheets table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Rate (£)</TableHead>
                      <TableHead className="text-right">Amount (£)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimesheets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No timesheets found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTimesheets.map((timesheet) => (
                        <TableRow key={timesheet.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedTimesheets.includes(timesheet.id)}
                                onChange={() => handleCheckboxChange(timesheet.id)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{timesheet.careProfessionalName}</div>
                              <div className="text-sm text-muted-foreground">ID: {timesheet.careProfessionalId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {timesheet.period}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <div className="font-medium">{timesheet.hours.toFixed(1)}</div>
                              <div className="text-xs text-muted-foreground">
                                {timesheet.regularHours.toFixed(1)} reg + {timesheet.overtimeHours.toFixed(1)} OT
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {timesheet.rate.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {timesheet.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(timesheet.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            {timesheet.status.toLowerCase() === 'pending' && (
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => approvalMutation.mutate({ ids: [timesheet.id], action: 'approve' })}
                                  disabled={approvalMutation.isPending}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => approvalMutation.mutate({ ids: [timesheet.id], action: 'reject' })}
                                  disabled={approvalMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination or load more could be added here */}
            </TabsContent>
            
            <TabsContent value="summary" className="space-y-4 pt-4">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimatedCard>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Staff Summary</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Staff</p>
                        <p className="text-2xl font-bold">{summary.staffCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Hours/Staff</p>
                        <p className="text-2xl font-bold">{summary.avgHoursPerStaff}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Hours Breakdown</h3>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{summary.totalHours.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Regular</p>
                        <p className="text-2xl font-bold">{summary.totalRegularHours.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Overtime</p>
                        <p className="text-2xl font-bold">{summary.totalOvertimeHours.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Financial Summary</h3>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Total Amount (£)</p>
                      <p className="text-3xl font-bold">{summary.totalAmount.toFixed(2)}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        For {filteredTimesheets.length} timesheet(s)
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
              
              {/* Additional analytics and charts would go here */}
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Analytics</CardTitle>
                  <CardDescription>Detailed breakdown of staff hours and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Detailed analytics charts will be displayed here.</p>
                    <p className="text-sm">Shows trends, department breakdowns, and cost analytics.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center w-full text-sm text-muted-foreground">
            <div>
              Showing {filteredTimesheets.length} timesheets
              {statusFilter !== 'all' && ` with status: ${statusFilter}`}
              {searchQuery && ` matching: "${searchQuery}"`}
            </div>
            <div>
              {selectedTimesheets.length > 0 && (
                <span className="font-medium">{selectedTimesheets.length} selected</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
