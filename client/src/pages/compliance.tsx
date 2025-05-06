import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, Download, Filter, MoreHorizontal, Plus, Search, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  completionRate: number;
  dueDate: string;
  status: 'active' | 'completed' | 'expired' | 'upcoming';
}

interface StaffTraining {
  id: string;
  staffName: string;
  role: string;
  trainingModules: {
    moduleId: string;
    moduleName: string;
    completionDate?: string;
    expiryDate?: string;
    status: 'complete' | 'overdue' | 'upcoming' | 'expired';
  }[];
  complianceStatus: 'compliant' | 'non-compliant' | 'partial';
  lastTrainingDate?: string;
}

interface CareProfessionalTraining extends StaffTraining {
  dbsStatus: 'valid' | 'expired' | 'pending';
  dbsExpiryDate?: string;
  nmcPinStatus?: 'valid' | 'expired' | 'pending' | 'not-applicable';
  nmcPinExpiryDate?: string;
}

const mockTrainingModules: TrainingModule[] = [
  {
    id: 'TRN001',
    title: 'Data Protection and GDPR',
    category: 'Information Governance',
    duration: '45 mins',
    completionRate: 92,
    dueDate: '30/06/2023',
    status: 'active',
  },
  {
    id: 'TRN002',
    title: 'Medication Administration',
    category: 'Clinical',
    duration: '60 mins',
    completionRate: 78,
    dueDate: '15/07/2023',
    status: 'active',
  },
  {
    id: 'TRN003',
    title: 'Health and Safety Essentials',
    category: 'Health & Safety',
    duration: '90 mins',
    completionRate: 85,
    dueDate: '22/06/2023',
    status: 'active',
  },
  {
    id: 'TRN004',
    title: 'Safeguarding Adults',
    category: 'Safeguarding',
    duration: '120 mins',
    completionRate: 95,
    dueDate: '15/07/2023',
    status: 'active',
  },
  {
    id: 'TRN005',
    title: 'Infection Control Procedures',
    category: 'Clinical',
    duration: '75 mins',
    completionRate: 88,
    dueDate: '05/07/2023',
    status: 'active',
  },
  {
    id: 'TRN006',
    title: 'Fire Safety',
    category: 'Health & Safety',
    duration: '30 mins',
    completionRate: 100,
    dueDate: '01/06/2023',
    status: 'completed',
  },
  {
    id: 'TRN007',
    title: 'Manual Handling',
    category: 'Health & Safety',
    duration: '60 mins',
    completionRate: 72,
    dueDate: '18/07/2023',
    status: 'active',
  },
];

const mockStaffTraining: StaffTraining[] = [
  {
    id: 'STAFF001',
    staffName: 'Dr. Emma Thompson',
    role: 'General Practitioner',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '15/05/2023', expiryDate: '15/05/2024', status: 'complete' },
      { moduleId: 'TRN003', moduleName: 'Health and Safety Essentials', completionDate: '10/04/2023', expiryDate: '10/04/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', completionDate: '05/03/2023', expiryDate: '05/03/2024', status: 'complete' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '20/05/2023', expiryDate: '20/05/2024', status: 'complete' },
    ],
    complianceStatus: 'compliant',
    lastTrainingDate: '20/05/2023',
  },
  {
    id: 'STAFF002',
    staffName: 'James Wilson',
    role: 'Clinical Lead',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '10/01/2023', expiryDate: '10/01/2024', status: 'complete' },
      { moduleId: 'TRN002', moduleName: 'Medication Administration', completionDate: '15/02/2023', expiryDate: '15/02/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', expiryDate: '01/06/2023', status: 'overdue' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '05/03/2023', expiryDate: '05/03/2024', status: 'complete' },
    ],
    complianceStatus: 'partial',
    lastTrainingDate: '15/02/2023',
  },
  {
    id: 'STAFF003',
    staffName: 'Sarah Johnson',
    role: 'Administrator',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '20/05/2023', expiryDate: '20/05/2024', status: 'complete' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '22/05/2023', expiryDate: '22/05/2024', status: 'complete' },
    ],
    complianceStatus: 'compliant',
    lastTrainingDate: '22/05/2023',
  },
];

const mockCareProfessionalTraining: CareProfessionalTraining[] = [
  {
    id: 'CARE001',
    staffName: 'Nurse Rebecca Miller',
    role: 'Registered Nurse',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '05/04/2023', expiryDate: '05/04/2024', status: 'complete' },
      { moduleId: 'TRN002', moduleName: 'Medication Administration', completionDate: '10/04/2023', expiryDate: '10/04/2024', status: 'complete' },
      { moduleId: 'TRN003', moduleName: 'Health and Safety Essentials', completionDate: '15/03/2023', expiryDate: '15/03/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', completionDate: '20/03/2023', expiryDate: '20/03/2024', status: 'complete' },
      { moduleId: 'TRN005', moduleName: 'Infection Control Procedures', completionDate: '01/04/2023', expiryDate: '01/04/2024', status: 'complete' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '25/05/2023', expiryDate: '25/05/2024', status: 'complete' },
      { moduleId: 'TRN007', moduleName: 'Manual Handling', completionDate: '30/04/2023', expiryDate: '30/04/2024', status: 'complete' },
    ],
    complianceStatus: 'compliant',
    lastTrainingDate: '25/05/2023',
    dbsStatus: 'valid',
    dbsExpiryDate: '15/05/2025',
    nmcPinStatus: 'valid',
    nmcPinExpiryDate: '31/12/2023',
  },
  {
    id: 'CARE002',
    staffName: 'John Davis',
    role: 'Healthcare Assistant',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '10/02/2023', expiryDate: '10/02/2024', status: 'complete' },
      { moduleId: 'TRN002', moduleName: 'Medication Administration', expiryDate: '15/06/2023', status: 'overdue' },
      { moduleId: 'TRN003', moduleName: 'Health and Safety Essentials', completionDate: '20/01/2023', expiryDate: '20/01/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', completionDate: '05/03/2023', expiryDate: '05/03/2024', status: 'complete' },
      { moduleId: 'TRN005', moduleName: 'Infection Control Procedures', expiryDate: '10/06/2023', status: 'overdue' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '15/05/2023', expiryDate: '15/05/2024', status: 'complete' },
      { moduleId: 'TRN007', moduleName: 'Manual Handling', completionDate: '20/04/2023', expiryDate: '20/04/2024', status: 'complete' },
    ],
    complianceStatus: 'partial',
    lastTrainingDate: '15/05/2023',
    dbsStatus: 'valid',
    dbsExpiryDate: '20/11/2023',
    nmcPinStatus: 'not-applicable',
  },
  {
    id: 'CARE003',
    staffName: 'Elizabeth Taylor',
    role: 'Physiotherapist',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '05/01/2023', expiryDate: '05/01/2024', status: 'complete' },
      { moduleId: 'TRN003', moduleName: 'Health and Safety Essentials', completionDate: '10/01/2023', expiryDate: '10/01/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', completionDate: '15/02/2023', expiryDate: '15/02/2024', status: 'complete' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', completionDate: '20/05/2023', expiryDate: '20/05/2024', status: 'complete' },
      { moduleId: 'TRN007', moduleName: 'Manual Handling', completionDate: '25/03/2023', expiryDate: '25/03/2024', status: 'complete' },
    ],
    complianceStatus: 'compliant',
    lastTrainingDate: '20/05/2023',
    dbsStatus: 'pending',
    dbsExpiryDate: '30/05/2023',
    nmcPinStatus: 'not-applicable',
  },
  {
    id: 'CARE004',
    staffName: 'Mark Johnson',
    role: 'Mental Health Nurse',
    trainingModules: [
      { moduleId: 'TRN001', moduleName: 'Data Protection and GDPR', completionDate: '15/12/2022', expiryDate: '15/12/2023', status: 'complete' },
      { moduleId: 'TRN002', moduleName: 'Medication Administration', completionDate: '10/01/2023', expiryDate: '10/01/2024', status: 'complete' },
      { moduleId: 'TRN003', moduleName: 'Health and Safety Essentials', completionDate: '05/02/2023', expiryDate: '05/02/2024', status: 'complete' },
      { moduleId: 'TRN004', moduleName: 'Safeguarding Adults', completionDate: '15/03/2023', expiryDate: '15/03/2024', status: 'complete' },
      { moduleId: 'TRN005', moduleName: 'Infection Control Procedures', completionDate: '20/04/2023', expiryDate: '20/04/2024', status: 'complete' },
      { moduleId: 'TRN006', moduleName: 'Fire Safety', expiryDate: '25/05/2023', status: 'expired' },
      { moduleId: 'TRN007', moduleName: 'Manual Handling', expiryDate: '01/06/2023', status: 'upcoming' },
    ],
    complianceStatus: 'partial',
    lastTrainingDate: '20/04/2023',
    dbsStatus: 'valid',
    dbsExpiryDate: '30/09/2024',
    nmcPinStatus: 'valid',
    nmcPinExpiryDate: '31/12/2023',
  },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('training');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'complete':
      case 'compliant':
      case 'valid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'partial':
      case 'upcoming':
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'expired':
      case 'overdue':
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const filteredModules = mockTrainingModules.filter(module => {
    if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !module.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && module.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const filteredStaff = mockStaffTraining.filter(staff => {
    if (searchQuery && !staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !staff.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredCareProfessionals = mockCareProfessionalTraining.filter(professional => {
    if (searchQuery && !professional.staffName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !professional.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const uniqueCategories = Array.from(new Set(mockTrainingModules.map(module => module.category)));

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance</h1>
          <p className="text-muted-foreground">Manage compliance policies, training, risk assessments, and audit logs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Module
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="credentials">Credential Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Policies</CardTitle>
              <CardDescription>Manage organizational policies and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Policies Section</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Manage and view all compliance policies, procedures, and guidelines.
                  </p>
                  <Button>View Policies</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Modules</CardTitle>
              <CardDescription>Manage and track staff training compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search modules..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> Add Training Module
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>{module.id}</TableCell>
                      <TableCell>{module.title}</TableCell>
                      <TableCell>{module.category}</TableCell>
                      <TableCell>{module.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={module.completionRate} 
                            max={100} 
                            className="h-2 w-20" 
                          />
                          <span className="text-sm">{module.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{module.dueDate}</TableCell>
                      <TableCell>{getStatusBadge(module.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Training Status</CardTitle>
                <CardDescription>Training compliance for administrative staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search staff..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Last Training</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>{staff.staffName}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>{getStatusBadge(staff.complianceStatus)}</TableCell>
                        <TableCell>{staff.lastTrainingDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Care Professional Training</CardTitle>
                <CardDescription>Training compliance for clinical care providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search care professionals..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>DBS Check</TableHead>
                      <TableHead>NMC Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCareProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>{professional.staffName}</TableCell>
                        <TableCell>{professional.role}</TableCell>
                        <TableCell>{getStatusBadge(professional.complianceStatus)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {getStatusBadge(professional.dbsStatus)}
                            {professional.dbsExpiryDate && (
                              <span className="text-xs text-gray-500 mt-1">Exp: {professional.dbsExpiryDate}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {professional.nmcPinStatus !== 'not-applicable' ? (
                            <div className="flex flex-col">
                              {getStatusBadge(professional.nmcPinStatus || 'pending')}
                              {professional.nmcPinExpiryDate && (
                                <span className="text-xs text-gray-500 mt-1">Exp: {professional.nmcPinExpiryDate}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Training Calendar</CardTitle>
              <CardDescription>Upcoming and scheduled training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Upcoming Training</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" /> View Calendar
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Schedule Training
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date('2025-05-15'), 'MMMM d, yyyy')}
                      </span>
                      <h4 className="font-medium">Safeguarding Refresher</h4>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Online</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">10:00 AM - 12:00 PM</p>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">12 participants enrolled</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date('2025-05-22'), 'MMMM d, yyyy')}
                      </span>
                      <h4 className="font-medium">Medication Administration</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In-Person</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">9:00 AM - 4:00 PM</p>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">8 participants enrolled</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date('2025-05-30'), 'MMMM d, yyyy')}
                      </span>
                      <h4 className="font-medium">Fire Safety Training</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In-Person</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">2:00 PM - 4:00 PM</p>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">15 participants enrolled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Risk management and compliance assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Risk Assessment Section</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Manage risk assessments, track mitigation strategies, and monitor compliance risks.
                  </p>
                  <Button>View Risk Assessments</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Compliance audit logs and records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Audit Log Section</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    View and manage compliance audit logs, inspection records, and audit findings.
                  </p>
                  <Button>View Audit Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credential Verification</CardTitle>
              <CardDescription>Professional credential checks and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Professional Credentials</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New Verification
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professional</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Credential Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Nurse Rebecca Miller</TableCell>
                    <TableCell>Registered Nurse</TableCell>
                    <TableCell>NMC PIN</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>01/01/2023</TableCell>
                    <TableCell>31/12/2023</TableCell>
                    <TableCell>15/04/2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nurse Rebecca Miller</TableCell>
                    <TableCell>Registered Nurse</TableCell>
                    <TableCell>DBS Check</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>15/05/2023</TableCell>
                    <TableCell>15/05/2025</TableCell>
                    <TableCell>15/05/2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mark Johnson</TableCell>
                    <TableCell>Mental Health Nurse</TableCell>
                    <TableCell>NMC PIN</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>01/01/2023</TableCell>
                    <TableCell>31/12/2023</TableCell>
                    <TableCell>10/03/2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>John Davis</TableCell>
                    <TableCell>Healthcare Assistant</TableCell>
                    <TableCell>DBS Check</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>20/11/2022</TableCell>
                    <TableCell>20/11/2023</TableCell>
                    <TableCell>20/01/2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Elizabeth Taylor</TableCell>
                    <TableCell>Physiotherapist</TableCell>
                    <TableCell>DBS Check</TableCell>
                    <TableCell>{getStatusBadge('pending')}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expiring Credentials Alert</CardTitle>
              <CardDescription>Credentials requiring attention soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium text-amber-800">Expiring Credentials Alert</h4>
                  <p className="text-sm text-amber-700">5 credentials are expiring in the next 30 days.</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professional</TableHead>
                    <TableHead>Credential Type</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Davis</TableCell>
                    <TableCell>DBS Check</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>20/11/2023</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary">Renew</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nurse Rebecca Miller</TableCell>
                    <TableCell>NMC PIN</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>31/12/2023</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary">Renew</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mark Johnson</TableCell>
                    <TableCell>NMC PIN</TableCell>
                    <TableCell>{getStatusBadge('valid')}</TableCell>
                    <TableCell>31/12/2023</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary">Renew</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-gray-500 mt-8">
        <p>© 2025 ComplexCare CRM. All information is subject to our compliance and data protection policies.</p>
      </div>
    </div>
  );
}
