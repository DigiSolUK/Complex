import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Calendar as CalendarIcon, Clock, Download, FileSpreadsheet, Filter, Plus, Search, Check, X, FileText, DollarSign, CalendarDays, Clock8 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';

interface Timesheet {
  id: string;
  careProfessionalId: string;
  careProfessionalName: string;
  role: string;
  week: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'processed';
  submittedDate?: string;
  reviewedDate?: string;
  reviewedBy?: string;
  processedDate?: string;
  notes?: string;
  days: TimesheetDay[];
  patients?: string[];
  breakTime?: number;
  payrollProcessed?: boolean;
  payrollExportDate?: string;
  payrollProvider?: string;
}

interface TimesheetDay {
  date: string;
  isWorked: boolean;
  startTime?: string;
  endTime?: string;
  breakTime?: number;
  totalHours?: number;
  patients?: Array<{
    patientId: string;
    patientName: string;
    hours: number;
  }>;
}

interface PayrollProvider {
  id: string;
  name: string;
  format: 'xls' | 'csv' | 'json' | 'api';
  requiresAdditionalFields: boolean;
  additionalFields?: Array<{
    name: string;
    required: boolean;
  }>;
  exportTemplate?: string;
}

// Mock data for payroll providers
const mockPayrollProviders: PayrollProvider[] = [
  {
    id: 'provider1',
    name: 'NHS Payroll Services',
    format: 'xls',
    requiresAdditionalFields: true,
    additionalFields: [
      { name: 'NHS Employee Number', required: true },
      { name: 'Department Code', required: true },
      { name: 'Cost Center', required: true },
    ],
    exportTemplate: 'nhs_payroll_template.xls'
  },
  {
    id: 'provider2',
    name: 'MedStaff Payroll',
    format: 'csv',
    requiresAdditionalFields: true,
    additionalFields: [
      { name: 'Staff ID', required: true },
      { name: 'Branch Code', required: false },
    ],
    exportTemplate: 'medstaff_payroll_template.csv'
  },
  {
    id: 'provider3',
    name: 'CareLink Payments',
    format: 'json',
    requiresAdditionalFields: false,
    exportTemplate: 'carelink_payroll_template.json'
  },
  {
    id: 'provider4',
    name: 'HealthPay Direct',
    format: 'api',
    requiresAdditionalFields: true,
    additionalFields: [
      { name: 'API Token', required: true },
      { name: 'Facility Code', required: true },
    ]
  }
];

// Mock data for timesheets
const mockTimesheets: Timesheet[] = [
  {
    id: 'ts-001',
    careProfessionalId: '1',
    careProfessionalName: 'Dr. Emma Thompson',
    role: 'General Practitioner',
    week: '2025-04-28',
    totalHours: 37.5,
    regularHours: 35,
    overtimeHours: 2.5,
    status: 'approved',
    submittedDate: '2025-05-04T18:23:00Z',
    reviewedDate: '2025-05-05T10:15:00Z',
    reviewedBy: 'Dr. Michael Chen',
    notes: 'Covered for Dr. Williams on Thursday afternoon',
    days: [
      {
        date: '2025-04-28',
        isWorked: true,
        startTime: '08:00',
        endTime: '17:00',
        breakTime: 60,
        totalHours: 8,
        patients: [
          { patientId: 'p1', patientName: 'John Smith', hours: 2 },
          { patientId: 'p2', patientName: 'Mary Johnson', hours: 1.5 },
          { patientId: 'p3', patientName: 'Robert Davis', hours: 3 }
        ]
      },
      {
        date: '2025-04-29',
        isWorked: true,
        startTime: '08:30',
        endTime: '17:30',
        breakTime: 60,
        totalHours: 8,
        patients: [
          { patientId: 'p4', patientName: 'Sarah Wilson', hours: 2.5 },
          { patientId: 'p5', patientName: 'James Brown', hours: 3 },
          { patientId: 'p6', patientName: 'Patricia Moore', hours: 1.5 }
        ]
      },
      {
        date: '2025-04-30',
        isWorked: true,
        startTime: '08:00',
        endTime: '17:00',
        breakTime: 60,
        totalHours: 8,
        patients: [
          { patientId: 'p7', patientName: 'Linda Taylor', hours: 2 },
          { patientId: 'p8', patientName: 'William Anderson', hours: 2 },
          { patientId: 'p9', patientName: 'Elizabeth Thomas', hours: 3 }
        ]
      },
      {
        date: '2025-05-01',
        isWorked: true,
        startTime: '09:00',
        endTime: '18:30',
        breakTime: 45,
        totalHours: 8.75,
        patients: [
          { patientId: 'p10', patientName: 'Michael White', hours: 2 },
          { patientId: 'p11', patientName: 'Susan Harris', hours: 3 },
          { patientId: 'p12', patientName: 'David Martin', hours: 3 }
        ]
      },
      {
        date: '2025-05-02',
        isWorked: true,
        startTime: '08:30',
        endTime: '13:15',
        breakTime: 30,
        totalHours: 4.75,
        patients: [
          { patientId: 'p13', patientName: 'Jennifer Thompson', hours: 2 },
          { patientId: 'p14', patientName: 'Charles Garcia', hours: 2 }
        ]
      },
      {
        date: '2025-05-03',
        isWorked: false,
        totalHours: 0
      },
      {
        date: '2025-05-04',
        isWorked: false,
        totalHours: 0
      }
    ],
    patients: ['John Smith', 'Mary Johnson', 'Robert Davis', 'Sarah Wilson', 'James Brown'],
    breakTime: 255,
    payrollProcessed: false
  },
  {
    id: 'ts-002',
    careProfessionalId: '2',
    careProfessionalName: 'Sarah Johnson',
    role: 'Registered Nurse',
    week: '2025-04-28',
    totalHours: 40,
    regularHours: 37.5,
    overtimeHours: 2.5,
    status: 'submitted',
    submittedDate: '2025-05-05T09:45:00Z',
    notes: 'Worked additional hours on Tuesday covering staff shortage',
    days: [
      {
        date: '2025-04-28',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p1', patientName: 'John Smith', hours: 4 },
          { patientId: 'p15', patientName: 'Dorothy Wilson', hours: 3.5 }
        ]
      },
      {
        date: '2025-04-29',
        isWorked: true,
        startTime: '07:00',
        endTime: '17:00',
        breakTime: 30,
        totalHours: 9.5,
        patients: [
          { patientId: 'p16', patientName: 'Richard Moore', hours: 4 },
          { patientId: 'p17', patientName: 'Barbara Jackson', hours: 4.5 }
        ]
      },
      {
        date: '2025-04-30',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p18', patientName: 'Daniel White', hours: 3.5 },
          { patientId: 'p19', patientName: 'Nancy Lewis', hours: 4 }
        ]
      },
      {
        date: '2025-05-01',
        isWorked: true,
        startTime: '14:00',
        endTime: '22:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p20', patientName: 'Thomas Young', hours: 4 },
          { patientId: 'p21', patientName: 'Helen Scott', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-02',
        isWorked: true,
        startTime: '14:00',
        endTime: '22:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p22', patientName: 'Joseph Hill', hours: 3 },
          { patientId: 'p23', patientName: 'Carol Evans', hours: 4.5 }
        ]
      },
      {
        date: '2025-05-03',
        isWorked: false,
        totalHours: 0
      },
      {
        date: '2025-05-04',
        isWorked: false,
        totalHours: 0
      }
    ],
    patients: ['John Smith', 'Dorothy Wilson', 'Richard Moore', 'Barbara Jackson', 'Daniel White'],
    breakTime: 150,
    payrollProcessed: false
  },
  {
    id: 'ts-003',
    careProfessionalId: '3',
    careProfessionalName: 'Robert Williams',
    role: 'Physiotherapist',
    week: '2025-04-28',
    totalHours: 30,
    regularHours: 30,
    overtimeHours: 0,
    status: 'processed',
    submittedDate: '2025-05-03T17:10:00Z',
    reviewedDate: '2025-05-04T11:30:00Z',
    reviewedBy: 'Dr. Michael Chen',
    processedDate: '2025-05-05T14:45:00Z',
    notes: 'Part-time hours as agreed',
    days: [
      {
        date: '2025-04-28',
        isWorked: true,
        startTime: '09:00',
        endTime: '15:00',
        breakTime: 30,
        totalHours: 5.5,
        patients: [
          { patientId: 'p24', patientName: 'George Baker', hours: 2.5 },
          { patientId: 'p25', patientName: 'Ruth King', hours: 2.5 }
        ]
      },
      {
        date: '2025-04-29',
        isWorked: true,
        startTime: '09:00',
        endTime: '15:00',
        breakTime: 30,
        totalHours: 5.5,
        patients: [
          { patientId: 'p26', patientName: 'Edward Allen', hours: 2 },
          { patientId: 'p27', patientName: 'Donna Green', hours: 3 }
        ]
      },
      {
        date: '2025-04-30',
        isWorked: true,
        startTime: '12:00',
        endTime: '19:00',
        breakTime: 30,
        totalHours: 6.5,
        patients: [
          { patientId: 'p28', patientName: 'Steven Nelson', hours: 3 },
          { patientId: 'p29', patientName: 'Deborah Carter', hours: 3 }
        ]
      },
      {
        date: '2025-05-01',
        isWorked: true,
        startTime: '09:00',
        endTime: '15:00',
        breakTime: 30,
        totalHours: 5.5,
        patients: [
          { patientId: 'p30', patientName: 'Kenneth Mitchell', hours: 2.5 },
          { patientId: 'p31', patientName: 'Sandra Phillips', hours: 2.5 }
        ]
      },
      {
        date: '2025-05-02',
        isWorked: true,
        startTime: '09:00',
        endTime: '16:00',
        breakTime: 30,
        totalHours: 6.5,
        patients: [
          { patientId: 'p32', patientName: 'Paul Campbell', hours: 3 },
          { patientId: 'p33', patientName: 'Sharon Roberts', hours: 3 }
        ]
      },
      {
        date: '2025-05-03',
        isWorked: false,
        totalHours: 0
      },
      {
        date: '2025-05-04',
        isWorked: false,
        totalHours: 0
      }
    ],
    patients: ['George Baker', 'Ruth King', 'Edward Allen', 'Donna Green', 'Steven Nelson'],
    breakTime: 150,
    payrollProcessed: true,
    payrollExportDate: '2025-05-05T14:45:00Z',
    payrollProvider: 'CareLink Payments'
  },
  {
    id: 'ts-004',
    careProfessionalId: '8',
    careProfessionalName: 'Emily Brown',
    role: 'Mental Health Nurse',
    week: '2025-04-28',
    totalHours: 36,
    regularHours: 36,
    overtimeHours: 0,
    status: 'draft',
    days: [
      {
        date: '2025-04-28',
        isWorked: true,
        startTime: '09:00',
        endTime: '17:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p34', patientName: 'Mark Turner', hours: 4 },
          { patientId: 'p35', patientName: 'Lisa Harris', hours: 3.5 }
        ]
      },
      {
        date: '2025-04-29',
        isWorked: false,
        totalHours: 0
      },
      {
        date: '2025-04-30',
        isWorked: true,
        startTime: '09:00',
        endTime: '17:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p36', patientName: 'Christopher Lewis', hours: 4 },
          { patientId: 'p37', patientName: 'Michelle Walker', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-01',
        isWorked: true,
        startTime: '09:00',
        endTime: '17:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p38', patientName: 'Ronald Hall', hours: 4 },
          { patientId: 'p39', patientName: 'Laura Young', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-02',
        isWorked: true,
        startTime: '09:00',
        endTime: '17:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p40', patientName: 'Donald Allen', hours: 4 },
          { patientId: 'p41', patientName: 'Kimberly King', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-03',
        isWorked: true,
        startTime: '09:00',
        endTime: '13:00',
        breakTime: 0,
        totalHours: 4,
        patients: [
          { patientId: 'p42', patientName: 'Jason Wright', hours: 4 }
        ]
      },
      {
        date: '2025-05-04',
        isWorked: false,
        totalHours: 0
      }
    ],
    patients: ['Mark Turner', 'Lisa Harris', 'Christopher Lewis', 'Michelle Walker', 'Ronald Hall'],
    breakTime: 120,
    payrollProcessed: false
  },
  {
    id: 'ts-005',
    careProfessionalId: '6',
    careProfessionalName: 'Susan Wilson',
    role: 'Healthcare Assistant',
    week: '2025-04-28',
    totalHours: 42,
    regularHours: 37.5,
    overtimeHours: 4.5,
    status: 'rejected',
    submittedDate: '2025-05-04T16:35:00Z',
    reviewedDate: '2025-05-05T08:50:00Z',
    reviewedBy: 'Dr. Michael Chen',
    notes: 'Overtime hours on Saturday not pre-approved. Please submit corrected timesheet.',
    days: [
      {
        date: '2025-04-28',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p43', patientName: 'Matthew Lopez', hours: 4 },
          { patientId: 'p44', patientName: 'Nancy Hill', hours: 3.5 }
        ]
      },
      {
        date: '2025-04-29',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p45', patientName: 'Gary Scott', hours: 4 },
          { patientId: 'p46', patientName: 'Rebecca Green', hours: 3.5 }
        ]
      },
      {
        date: '2025-04-30',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p47', patientName: 'Raymond Adams', hours: 4 },
          { patientId: 'p48', patientName: 'Stephanie Baker', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-01',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p49', patientName: 'Jeffrey Nelson', hours: 4 },
          { patientId: 'p50', patientName: 'Kathleen Carter', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-02',
        isWorked: true,
        startTime: '07:00',
        endTime: '15:30',
        breakTime: 30,
        totalHours: 8,
        patients: [
          { patientId: 'p51', patientName: 'Anthony Mitchell', hours: 4 },
          { patientId: 'p52', patientName: 'Sharon Phillips', hours: 3.5 }
        ]
      },
      {
        date: '2025-05-03',
        isWorked: true,
        startTime: '08:00',
        endTime: '12:30',
        breakTime: 30,
        totalHours: 4,
        patients: [
          { patientId: 'p53', patientName: 'Dennis Campbell', hours: 4 }
        ]
      },
      {
        date: '2025-05-04',
        isWorked: false,
        totalHours: 0
      }
    ],
    patients: ['Matthew Lopez', 'Nancy Hill', 'Gary Scott', 'Rebecca Green', 'Raymond Adams'],
    breakTime: 180,
    payrollProcessed: false
  }
];

const TimesheetCard: React.FC<{ timesheet: Timesheet; onView: (id: string) => void }> = ({ 
  timesheet, 
  onView 
}) => {
  const getStatusBadge = (status: Timesheet['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'processed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Processed</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(timesheet.careProfessionalName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{timesheet.careProfessionalName}</CardTitle>
              <CardDescription className="text-xs">{timesheet.role}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(timesheet.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Week Starting</span>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{format(new Date(timesheet.week), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Hours</span>
            <div className="flex items-center gap-1">
              <Clock8 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{timesheet.totalHours} ({timesheet.regularHours} + {timesheet.overtimeHours} OT)</span>
            </div>
          </div>
        </div>
        
        {timesheet.submittedDate && (
          <div className="text-xs text-muted-foreground">
            Submitted: {format(new Date(timesheet.submittedDate), 'MMM d, yyyy, HH:mm')}
          </div>
        )}
        
        {timesheet.reviewedDate && (
          <div className="text-xs text-muted-foreground">
            Reviewed: {format(new Date(timesheet.reviewedDate), 'MMM d, yyyy, HH:mm')}
          </div>
        )}
        
        {timesheet.payrollProcessed && (
          <div className="flex items-center gap-1 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-xs px-2 py-0">
              <Check className="h-3 w-3 mr-1" /> Payroll Processed
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full" onClick={() => onView(timesheet.id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Timesheets() {
  const { isAdmin, user } = useAuth();
  const [timesheets, setTimesheets] = useState<Timesheet[]>(mockTimesheets);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timesheetDetailOpen, setTimesheetDetailOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [payrollExportOpen, setPayrollExportOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [viewMode, setViewMode] = useState<'staff' | 'clinical' | 'finance'>('staff');
  const [newTimesheetOpen, setNewTimesheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Determine the role-based view mode
  React.useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      setViewMode('finance');
    } else if (user?.role === 'care_staff') {
      setViewMode('staff');
    } else {
      setViewMode('clinical');
    }
  }, [user]);

  const filteredTimesheets = timesheets.filter(timesheet => {
    // Search filter
    if (
      searchQuery &&
      !timesheet.careProfessionalName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Tab filter
    if (activeTab === 'draft' && timesheet.status !== 'draft') return false;
    if (activeTab === 'submitted' && timesheet.status !== 'submitted') return false;
    if (activeTab === 'approved' && timesheet.status !== 'approved') return false;
    if (activeTab === 'rejected' && timesheet.status !== 'rejected') return false;
    if (activeTab === 'processed' && timesheet.status !== 'processed') return false;
    if (activeTab === 'pending-payroll' && (timesheet.status !== 'approved' || timesheet.payrollProcessed)) return false;

    return true;
  });

  const handleViewTimesheet = (id: string) => {
    const timesheet = timesheets.find(t => t.id === id);
    if (timesheet) {
      setSelectedTimesheet(timesheet);
      setTimesheetDetailOpen(true);
    }
  };

  const handleStatusChange = (status: Timesheet['status']) => {
    if (selectedTimesheet) {
      const updatedTimesheets = timesheets.map(t => {
        if (t.id === selectedTimesheet.id) {
          const updatedTimesheet = { ...t, status };
          if (status === 'approved' || status === 'rejected') {
            updatedTimesheet.reviewedDate = new Date().toISOString();
            updatedTimesheet.reviewedBy = user?.name || 'Admin User';
          }
          if (status === 'processed') {
            updatedTimesheet.processedDate = new Date().toISOString();
            updatedTimesheet.payrollProcessed = true;
            updatedTimesheet.payrollExportDate = new Date().toISOString();
            updatedTimesheet.payrollProvider = selectedProvider;
          }
          return updatedTimesheet;
        }
        return t;
      });
      setTimesheets(updatedTimesheets);
      setSelectedTimesheet(null);
      setTimesheetDetailOpen(false);
    }
  };

  const handlePayrollExport = () => {
    setPayrollExportOpen(true);
  };

  const renderTimesheetDetails = () => {
    if (!selectedTimesheet) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{selectedTimesheet.careProfessionalName}</h3>
            <p className="text-muted-foreground">{selectedTimesheet.role}</p>
          </div>
          <div>
            {renderTimesheetStatusBadge(selectedTimesheet.status)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Week Starting</h4>
            <p>{format(new Date(selectedTimesheet.week), 'PPP')}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Total Hours</h4>
            <p>{selectedTimesheet.totalHours}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Regular Hours</h4>
            <p>{selectedTimesheet.regularHours}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Overtime Hours</h4>
            <p>{selectedTimesheet.overtimeHours}</p>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Daily Breakdown</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="hidden md:table-cell">Start</TableHead>
                <TableHead className="hidden md:table-cell">End</TableHead>
                <TableHead className="hidden md:table-cell">Break</TableHead>
                <TableHead className="hidden lg:table-cell">Patients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTimesheet.days.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>{format(new Date(day.date), 'E, MMM d')}</TableCell>
                  <TableCell>{day.isWorked ? day.totalHours : '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{day.isWorked ? day.startTime : '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{day.isWorked ? day.endTime : '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{day.isWorked ? `${day.breakTime} min` : '—'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {day.isWorked && day.patients && day.patients.length > 0 
                      ? day.patients.map(p => p.patientName).join(', ')
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedTimesheet.notes && (
          <div>
            <h4 className="text-sm font-medium">Notes</h4>
            <p className="text-sm text-muted-foreground">{selectedTimesheet.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {selectedTimesheet.submittedDate && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Submitted</h4>
              <p>{format(new Date(selectedTimesheet.submittedDate), 'PPp')}</p>
            </div>
          )}
          {selectedTimesheet.reviewedDate && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Reviewed</h4>
              <p>{format(new Date(selectedTimesheet.reviewedDate), 'PPp')}</p>
              <p className="text-sm text-muted-foreground">by {selectedTimesheet.reviewedBy}</p>
            </div>
          )}
        </div>

        {viewMode === 'clinical' && selectedTimesheet.status === 'submitted' && (
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
              onClick={() => handleStatusChange('rejected')}
            >
              <X className="h-4 w-4 mr-2" /> Reject
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusChange('approved')}
            >
              <Check className="h-4 w-4 mr-2" /> Approve
            </Button>
          </div>
        )}

        {viewMode === 'finance' && selectedTimesheet.status === 'approved' && !selectedTimesheet.payrollProcessed && (
          <div className="mt-6">
            <Button className="w-full" onClick={handlePayrollExport}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Process for Payroll
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderTimesheetStatusBadge = (status: Timesheet['status']) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'processed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Processed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">Timesheets</h2>
          <p className="text-gray-500 mt-2">Manage and process staff working hours</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={payrollExportOpen} onOpenChange={setPayrollExportOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export to Payroll</DialogTitle>
                <DialogDescription>
                  Select the payroll provider format to export approved timesheets.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="payroll-provider">Payroll Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger id="payroll-provider">
                      <SelectValue placeholder="Select payroll provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPayrollProviders.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name} ({provider.format.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProvider && (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Export Details</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="block">
                        <strong>Format:</strong> {mockPayrollProviders.find(p => p.id === selectedProvider)?.format.toUpperCase()}
                      </span>
                      <span className="block mt-1">
                        <strong>Records:</strong> {timesheets.filter(t => t.status === 'approved' && !t.payrollProcessed).length} timesheets
                      </span>
                    </p>
                    
                    {mockPayrollProviders.find(p => p.id === selectedProvider)?.requiresAdditionalFields && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Additional Information Required</h5>
                        <div className="space-y-2">
                          {mockPayrollProviders.find(p => p.id === selectedProvider)?.additionalFields?.map(field => (
                            <div key={field.name} className="grid gap-1">
                              <Label htmlFor={`field-${field.name}`} className="text-xs">
                                {field.name} {field.required && <span className="text-red-500">*</span>}
                              </Label>
                              <Input id={`field-${field.name}`} placeholder={field.name} className="h-8" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPayrollExportOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  if (selectedTimesheet) {
                    handleStatusChange('processed');
                  }
                  setPayrollExportOpen(false);
                }}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Payroll
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={timesheetDetailOpen} onOpenChange={setTimesheetDetailOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Timesheet Details</DialogTitle>
              </DialogHeader>
              {renderTimesheetDetails()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setTimesheetDetailOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={newTimesheetOpen} onOpenChange={setNewTimesheetOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Timesheet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Timesheet</DialogTitle>
                <DialogDescription>
                  Create a new timesheet for the selected week.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="week-start">Week Starting</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-4 pt-4">
                  <h3 className="font-medium">Daily Schedule</h3>
                  <div className="space-y-4">
                    {/* Sample day entry form */}
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                      <div key={day} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{day}</h4>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`worked-${day}`} />
                            <Label htmlFor={`worked-${day}`}>Worked</Label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="grid gap-1">
                            <Label htmlFor={`start-${day}`} className="text-xs">Start Time</Label>
                            <Input type="time" id={`start-${day}`} />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor={`end-${day}`} className="text-xs">End Time</Label>
                            <Input type="time" id={`end-${day}`} />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor={`break-${day}`} className="text-xs">Break (min)</Label>
                            <Input type="number" id={`break-${day}`} defaultValue="30" />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor={`hours-${day}`} className="text-xs">Total Hours</Label>
                            <Input type="text" id={`hours-${day}`} readOnly disabled />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional notes here..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTimesheetOpen(false)}>Cancel</Button>
                <Button>Save as Draft</Button>
                <Button className="bg-green-600 hover:bg-green-700">Submit Timesheet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search timesheets..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setNewTimesheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Timesheet
          </Button>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-7 lg:w-auto w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
            <TabsTrigger value="pending-payroll">Pending Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredTimesheets.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTimesheets.map((timesheet) => (
                  <TimesheetCard 
                    key={timesheet.id}
                    timesheet={timesheet}
                    onView={handleViewTimesheet}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No timesheets found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? `No timesheets matching "${searchQuery}" were found. Try adjusting your search.`
                      : activeTab === 'pending-payroll'
                        ? 'No timesheets pending payroll processing.'
                        : `No ${activeTab} timesheets found.`}
                  </p>
                  <Button className="mt-4" onClick={() => setNewTimesheetOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Timesheet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
