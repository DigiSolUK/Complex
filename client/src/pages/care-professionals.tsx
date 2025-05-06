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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Calendar,
  Clock,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  Search,
  Plus,
  UserRound,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock8,
  Clipboard,
  CalendarClock,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CareProfessional {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  address: string;
  specialties: string[];
  qualifications: string[];
  profileImage?: string;
  hireDate: string;
  nmcPin?: {
    number: string;
    expiryDate: string;
    status: 'valid' | 'expired' | 'pending' | 'not_applicable';
    lastVerified: string;
  };
  dbsCheck?: {
    number: string;
    issueDate: string;
    status: 'valid' | 'expired' | 'pending';
    level: 'basic' | 'standard' | 'enhanced';
    lastVerified: string;
  };
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rating?: number;
  reviews?: number;
}

const mockCareProfessionals: CareProfessional[] = [
  {
    id: '1',
    name: 'Dr. Emma Thompson',
    role: 'General Practitioner',
    email: 'emma.thompson@complexcare.org',
    phone: '+44 20 7123 4567',
    status: 'active',
    address: '123 Harley Street, London, W1G 7JU',
    specialties: ['Geriatric Care', 'Chronic Disease Management'],
    qualifications: ['MBBS', 'MRCGP', 'DCH'],
    hireDate: '2023-04-15',
    nmcPin: {
      number: '98C1234E',
      expiryDate: '2026-07-31',
      status: 'valid',
      lastVerified: '2025-01-15',
    },
    dbsCheck: {
      number: 'ENH001234567',
      issueDate: '2024-12-10',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-01-15',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.9,
    reviews: 127,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Specialist - Cardiology',
    email: 'michael.chen@complexcare.org',
    phone: '+44 20 7123 8901',
    status: 'active',
    address: '45 Wimpole Street, London, W1G 8SQ',
    specialties: ['Cardiovascular Care', 'Hypertension Management'],
    qualifications: ['MBBS', 'MRCP', 'PhD Cardiovascular Medicine'],
    hireDate: '2022-11-05',
    nmcPin: {
      number: '98D5678F',
      expiryDate: '2027-03-15',
      status: 'valid',
      lastVerified: '2025-02-08',
    },
    dbsCheck: {
      number: 'ENH002345678',
      issueDate: '2024-11-23',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-02-08',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.8,
    reviews: 94,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'Registered Nurse',
    email: 'sarah.johnson@complexcare.org',
    phone: '+44 20 7123 5678',
    status: 'active',
    address: '78 Nursing Lane, Manchester, M1 7GH',
    specialties: ['Wound Care', 'Diabetes Management'],
    qualifications: ['BSc Nursing', 'RN'],
    hireDate: '2024-01-20',
    nmcPin: {
      number: '19I4321J',
      expiryDate: '2026-04-30',
      status: 'valid',
      lastVerified: '2025-03-01',
    },
    dbsCheck: {
      number: 'ENH003456789',
      issueDate: '2024-12-18',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-03-01',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    rating: 4.7,
    reviews: 86,
  },
  {
    id: '4',
    name: 'Jane Adams',
    role: 'Care Coordinator',
    email: 'jane.adams@complexcare.org',
    phone: '+44 20 7123 6789',
    status: 'active',
    address: '45 Coordination Street, Birmingham, B1 2JD',
    specialties: ['Care Planning', 'Patient Advocacy'],
    qualifications: ['BSc Health & Social Care', 'Diploma in Care Coordination'],
    hireDate: '2023-08-12',
    dbsCheck: {
      number: 'STD004567890',
      issueDate: '2024-10-05',
      status: 'valid',
      level: 'standard',
      lastVerified: '2025-02-15',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.6,
    reviews: 62,
  },
  {
    id: '5',
    name: 'Robert Williams',
    role: 'Physiotherapist',
    email: 'robert.williams@complexcare.org',
    phone: '+44 20 7123 7890',
    status: 'active',
    address: '92 Therapy Avenue, Leeds, LS1 5TP',
    specialties: ['Geriatric Rehabilitation', 'Neurological Rehabilitation'],
    qualifications: ['BSc Physiotherapy', 'MSc Advanced Physiotherapy'],
    hireDate: '2023-06-15',
    dbsCheck: {
      number: 'ENH005678901',
      issueDate: '2024-09-30',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-02-20',
    },
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.8,
    reviews: 79,
  },
  {
    id: '6',
    name: 'Susan Wilson',
    role: 'Healthcare Assistant',
    email: 'susan.wilson@complexcare.org',
    phone: '+44 20 7123 8901',
    status: 'active',
    address: '17 Helper Street, Bristol, BS1 6TY',
    specialties: ['Personal Care', 'Mobility Assistance'],
    qualifications: ['NVQ Level 3 Health and Social Care'],
    hireDate: '2024-02-08',
    dbsCheck: {
      number: 'ENH006789012',
      issueDate: '2025-01-15',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-02-25',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    rating: 4.5,
    reviews: 43,
  },
  {
    id: '7',
    name: 'David Clark',
    role: 'Occupational Therapist',
    email: 'david.clark@complexcare.org',
    phone: '+44 20 7123 9012',
    status: 'pending',
    address: '38 Therapy Lane, Glasgow, G1 7RT',
    specialties: ['Home Adaptations', 'Daily Living Skills'],
    qualifications: ['BSc Occupational Therapy'],
    hireDate: '2025-04-01',
    dbsCheck: {
      number: 'ENH007890123',
      issueDate: '2025-03-10',
      status: 'pending',
      level: 'enhanced',
      lastVerified: '2025-03-10',
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: false,
      saturday: false,
      sunday: false,
    },
  },
  {
    id: '8',
    name: 'Emily Brown',
    role: 'Mental Health Nurse',
    email: 'emily.brown@complexcare.org',
    phone: '+44 20 7123 0123',
    status: 'active',
    address: '54 Wellbeing Road, Edinburgh, EH1 2MH',
    specialties: ['Depression & Anxiety', 'Dementia Care'],
    qualifications: ['BSc Mental Health Nursing', 'PGDip Cognitive Behavioural Therapy'],
    hireDate: '2023-11-15',
    nmcPin: {
      number: '20K5678L',
      expiryDate: '2026-05-31',
      status: 'valid',
      lastVerified: '2025-01-30',
    },
    dbsCheck: {
      number: 'ENH008901234',
      issueDate: '2024-10-25',
      status: 'valid',
      level: 'enhanced',
      lastVerified: '2025-01-30',
    },
    availability: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.9,
    reviews: 58,
  },
];

const ProfessionalCard: React.FC<{ professional: CareProfessional }> = ({ professional }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const getStatusBadge = (status: CareProfessional['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return null;
    }
  };

  const getRegulationStatus = (item?: any) => {
    if (!item) return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">N/A</Badge>;

    switch (item.status) {
      case 'valid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Valid</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">N/A</Badge>;
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
            <Avatar className="h-10 w-10">
              <AvatarImage src={professional.profileImage} />
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(professional.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{professional.name}</CardTitle>
              <CardDescription className="text-xs">{professional.role}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(professional.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-sm">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs truncate">{professional.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{professional.phone}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {professional.specialties.map(specialty => (
            <span 
              key={specialty} 
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">NMC Pin</p>
            <div className="flex items-center justify-between">
              <span className="text-xs">{professional.nmcPin?.number || 'N/A'}</span>
              {getRegulationStatus(professional.nmcPin)}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">DBS Check</p>
            <div className="flex items-center justify-between">
              <span className="text-xs truncate max-w-[80px]">{professional.dbsCheck?.number || 'N/A'}</span>
              {getRegulationStatus(professional.dbsCheck)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 pt-2">
        <div className="flex items-center">
          {professional.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{professional.rating}</span>
              <span className="text-xs text-muted-foreground">({professional.reviews})</span>
            </div>
          )}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">View Profile</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Professional Profile</SheetTitle>
              <SheetDescription>Details and verification information</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={professional.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">{getInitials(professional.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{professional.name}</h3>
                  <p className="text-muted-foreground">{professional.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(professional.status)}
                    {professional.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{professional.rating}</span>
                        <span className="text-xs text-muted-foreground">({professional.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{professional.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{professional.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{professional.address}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Qualifications & Specialties</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Qualifications</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.qualifications.map(qualification => (
                        <Badge key={qualification} variant="secondary">{qualification}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Regulatory Information</h4>
                <div className="space-y-4">
                  {professional.nmcPin && (
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">NMC Pin</p>
                          <p className="text-sm text-muted-foreground">{professional.nmcPin.number}</p>
                        </div>
                        {getRegulationStatus(professional.nmcPin)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expiry Date</p>
                          <p>{new Date(professional.nmcPin.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Verified</p>
                          <p>{new Date(professional.nmcPin.lastVerified).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {professional.nmcPin.status === 'valid' ? (
                          <><CheckCircle className="h-4 w-4 text-green-600" /> <span className="text-sm">Valid and verified</span></>
                        ) : professional.nmcPin.status === 'expired' ? (
                          <><AlertCircle className="h-4 w-4 text-red-600" /> <span className="text-sm">Expired registration</span></>
                        ) : (
                          <><Clock8 className="h-4 w-4 text-yellow-600" /> <span className="text-sm">Verification pending</span></>
                        )}
                      </div>
                    </div>
                  )}

                  {professional.dbsCheck && (
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">DBS Check ({professional.dbsCheck.level.charAt(0).toUpperCase() + professional.dbsCheck.level.slice(1)})</p>
                          <p className="text-sm text-muted-foreground">{professional.dbsCheck.number}</p>
                        </div>
                        {getRegulationStatus(professional.dbsCheck)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Issue Date</p>
                          <p>{new Date(professional.dbsCheck.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Verified</p>
                          <p>{new Date(professional.dbsCheck.lastVerified).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {professional.dbsCheck.status === 'valid' ? (
                          <><ShieldCheck className="h-4 w-4 text-green-600" /> <span className="text-sm">Valid and verified</span></>
                        ) : professional.dbsCheck.status === 'expired' ? (
                          <><ShieldAlert className="h-4 w-4 text-red-600" /> <span className="text-sm">Expired check</span></>
                        ) : (
                          <><ShieldQuestion className="h-4 w-4 text-yellow-600" /> <span className="text-sm">Verification pending</span></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Availability</h4>
                {professional.availability ? (
                  <div className="grid grid-cols-7 gap-1">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="text-center">
                        <div className={`text-xs font-medium mb-1`}>{day.charAt(0).toUpperCase()}</div>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${professional.availability?.[day as keyof typeof professional.availability] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                          {professional.availability?.[day as keyof typeof professional.availability] ? '✓' : '✗'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Availability information not provided</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Employment Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Hire Date</p>
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="h-4 w-4 text-primary" />
                      <p>{new Date(professional.hireDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <div className="flex items-center gap-1.5">
                      <Clipboard className="h-4 w-4 text-primary" />
                      <p>{professional.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">Edit Profile</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
};

export default function CareProfessionals() {
  const [professionals, setProfessionals] = useState<CareProfessional[]>(mockCareProfessionals);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addProfessionalOpen, setAddProfessionalOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verifyType, setVerifyType] = useState<'nmc' | 'dbs' | null>(null);
  const [verifyId, setVerifyId] = useState<string | null>(null);

  const filteredProfessionals = professionals.filter(professional => {
    // Search filter
    if (
      searchQuery &&
      !professional.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !professional.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !professional.specialties.some(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }

    // Tab filter
    if (activeTab === 'active' && professional.status !== 'active') return false;
    if (activeTab === 'pending' && professional.status !== 'pending') return false;
    if (activeTab === 'inactive' && professional.status !== 'inactive') return false;
    if (activeTab === 'expired-checks') {
      return (
        (professional.nmcPin?.status === 'expired') ||
        (professional.dbsCheck?.status === 'expired')
      );
    }
    if (activeTab === 'verify-needed') {
      const nmcNearly = professional.nmcPin && new Date(professional.nmcPin.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const dbsNearly = professional.dbsCheck && new Date(professional.dbsCheck.issueDate) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      return nmcNearly || dbsNearly;
    }

    return true;
  });

  const handleVerifyOpen = (type: 'nmc' | 'dbs', id: string) => {
    setVerifyType(type);
    setVerifyId(id);
    setVerificationDialogOpen(true);
  };

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">Care Professionals</h2>
          <p className="text-gray-500 mt-2">Manage healthcare professionals and check regulatory compliance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={addProfessionalOpen} onOpenChange={setAddProfessionalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Professional
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Care Professional</DialogTitle>
                <DialogDescription>
                  Enter the details of the new care professional to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor/GP</SelectItem>
                        <SelectItem value="nurse">Registered Nurse</SelectItem>
                        <SelectItem value="therapist">Therapist</SelectItem>
                        <SelectItem value="coordinator">Care Coordinator</SelectItem>
                        <SelectItem value="assistant">Healthcare Assistant</SelectItem>
                        <SelectItem value="other">Other Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email address" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Phone number" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Work address" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nmc-pin">NMC PIN (if applicable)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="nmc-pin" placeholder="NMC PIN number" />
                    <Input id="nmc-expiry" type="date" placeholder="Expiry date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dbs-check">DBS Check</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="dbs-check" placeholder="DBS certificate number" />
                    <Select>
                      <SelectTrigger id="dbs-level">
                        <SelectValue placeholder="DBS check level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enhanced">Enhanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hire-date">Hire Date</Label>
                  <Input id="hire-date" type="date" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="specialties">Specialties (comma separated)</Label>
                  <Input id="specialties" placeholder="E.g. Geriatric Care, Wound Management" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
                  <Input id="qualifications" placeholder="E.g. BSc Nursing, MBBS" />
                </div>

                <div className="grid gap-2">
                  <Label>Availability</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="flex flex-col items-center">
                        <Label htmlFor={`day-${day}`} className="text-xs mb-1">{day}</Label>
                        <Checkbox id={`day-${day}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddProfessionalOpen(false)}>Cancel</Button>
                <Button onClick={() => setAddProfessionalOpen(false)}>Add Professional</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{verifyType === 'nmc' ? 'Verify NMC PIN' : 'Verify DBS Check'}</DialogTitle>
                <DialogDescription>
                  {verifyType === 'nmc' 
                    ? 'Verify the nurse or healthcare professional\'s NMC PIN number and registration status.'
                    : 'Verify the status and details of the professional\'s DBS (Disclosure and Barring Service) check.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {verifyType === 'nmc' ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="nmc-number">NMC PIN Number</Label>
                      <Input 
                        id="nmc-number" 
                        defaultValue={professionals.find(p => p.id === verifyId)?.nmcPin?.number || ''} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nmc-name">Full Name (as registered with NMC)</Label>
                      <Input 
                        id="nmc-name" 
                        defaultValue={professionals.find(p => p.id === verifyId)?.name || ''} 
                      />
                    </div>
                    <Button className="w-full" variant="outline">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Check with NMC Register
                    </Button>
                    <div className="rounded-md bg-green-50 p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Verification successful</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Registration is valid until 31 July 2026. Registration includes the following qualifications:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                              <li>Registered Nurse - Adult (Level 1)</li>
                              <li>Specialist Community Public Health Nurse</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="dbs-number">DBS Certificate Number</Label>
                      <Input 
                        id="dbs-number" 
                        defaultValue={professionals.find(p => p.id === verifyId)?.dbsCheck?.number || ''} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dbs-date">Date of Issue</Label>
                      <Input 
                        id="dbs-date" 
                        type="date"
                        defaultValue={professionals.find(p => p.id === verifyId)?.dbsCheck?.issueDate || ''} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dbs-type">Check Type</Label>
                      <Select defaultValue={professionals.find(p => p.id === verifyId)?.dbsCheck?.level || 'enhanced'}>
                        <SelectTrigger id="dbs-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Check</SelectItem>
                          <SelectItem value="standard">Standard Check</SelectItem>
                          <SelectItem value="enhanced">Enhanced Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="original-seen" />
                      <Label htmlFor="original-seen">Original certificate has been seen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="no-convictions" />
                      <Label htmlFor="no-convictions">No relevant convictions or warnings found</Label>
                    </div>
                    <div className="rounded-md bg-green-50 p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ShieldCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">DBS check verified</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Enhanced DBS check has been verified and is suitable for working with vulnerable adults.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setVerificationDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setVerificationDialogOpen(false)}>Confirm Verification</Button>
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
              placeholder="Search professionals..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6 lg:w-auto w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="expired-checks">Expired Checks</TabsTrigger>
            <TabsTrigger value="verify-needed">Needs Verification</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredProfessionals.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No professionals found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? `No professionals matching "${searchQuery}" were found. Try adjusting your search or filters.`
                      : activeTab === 'expired-checks'
                        ? 'No professionals with expired regulatory checks. All compliance requirements are up to date.'
                        : activeTab === 'verify-needed'
                          ? 'No professionals currently need verification. All checks are up to date.'
                          : `No ${activeTab} professionals found. Add a new professional to get started.`}
                  </p>
                  <Button className="mt-4" onClick={() => setAddProfessionalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Professional
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
