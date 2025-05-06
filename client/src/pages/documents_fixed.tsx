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
import {
  Calendar,
  Clock,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  FolderClosed,
  Image,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
  UserRound,
  FileSpreadsheet,
  FileImage,
  FileAudio,
  FolderOpen,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'text' | 'audio' | 'other';
  size: string;
  category: string;
  patientId?: string;
  patientName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  isShared: boolean;
  isFavorite?: boolean;
  path: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Patient Admission Form - James Wilson.pdf',
    type: 'pdf',
    size: '1.4 MB',
    category: 'Forms',
    patientId: '12345',
    patientName: 'James Wilson',
    createdBy: 'Dr. Emma Thompson',
    createdAt: '2025-05-03',
    updatedAt: '2025-05-03',
    tags: ['admission', 'patient', 'form'],
    isShared: false,
    path: '/documents/patients/james_wilson/admission_form.pdf',
  },
  {
    id: '2',
    name: 'Blood Test Results - Sarah Johnson.pdf',
    type: 'pdf',
    size: '2.8 MB',
    category: 'Lab Results',
    patientId: '12346',
    patientName: 'Sarah Johnson',
    createdBy: 'Dr. Michael Chen',
    createdAt: '2025-05-02',
    updatedAt: '2025-05-02',
    tags: ['blood test', 'lab', 'results'],
    isShared: true,
    path: '/documents/patients/sarah_johnson/blood_test_results.pdf',
  },
  {
    id: '3',
    name: 'Care Plan Template.xlsx',
    type: 'spreadsheet',
    size: '520 KB',
    category: 'Templates',
    createdBy: 'Jane Adams',
    createdAt: '2025-04-15',
    updatedAt: '2025-04-30',
    tags: ['template', 'care plan', 'form'],
    isShared: true,
    isFavorite: true,
    path: '/documents/templates/care_plan_template.xlsx',
  },
  {
    id: '4',
    name: 'Staff Training Schedule Q2 2025.xlsx',
    type: 'spreadsheet',
    size: '750 KB',
    category: 'Administrative',
    createdBy: 'Susan Williams',
    createdAt: '2025-04-28',
    updatedAt: '2025-05-01',
    tags: ['training', 'schedule', 'staff'],
    isShared: true,
    path: '/documents/administration/staff_training_q2_2025.xlsx',
  },
  {
    id: '5',
    name: 'X-Ray Image - Robert Brown.jpg',
    type: 'image',
    size: '3.2 MB',
    category: 'Medical Imaging',
    patientId: '12348',
    patientName: 'Robert Brown',
    createdBy: 'Dr. Emma Thompson',
    createdAt: '2025-05-01',
    tags: ['x-ray', 'imaging', 'knee'],
    isShared: false,
    path: '/documents/patients/robert_brown/xray.jpg',
  },
  {
    id: '6',
    name: 'Medication Guidelines 2025.pdf',
    type: 'pdf',
    size: '4.6 MB',
    category: 'Protocols',
    createdBy: 'Dr. Michael Chen',
    createdAt: '2025-03-15',
    tags: ['medication', 'guidelines', 'protocols'],
    isShared: true,
    isFavorite: true,
    path: '/documents/protocols/medication_guidelines_2025.pdf',
  },
  {
    id: '7',
    name: 'Patient Discharge Instructions - Mary Davis.pdf',
    type: 'pdf',
    size: '650 KB',
    category: 'Forms',
    patientId: '12347',
    patientName: 'Mary Davis',
    createdBy: 'Jane Adams',
    createdAt: '2025-05-02',
    updatedAt: '2025-05-04',
    tags: ['discharge', 'instructions', 'patient'],
    isShared: false,
    path: '/documents/patients/mary_davis/discharge_instructions.pdf',
  },
  {
    id: '8',
    name: 'Care Home Inspection Report.pdf',
    type: 'pdf',
    size: '3.8 MB',
    category: 'Reports',
    createdBy: 'Susan Williams',
    createdAt: '2025-04-20',
    tags: ['inspection', 'care home', 'compliance', 'report'],
    isShared: true,
    path: '/documents/reports/care_home_inspection_2025.pdf',
  },
  {
    id: '9',
    name: 'Team Meeting Audio Recording.mp3',
    type: 'audio',
    size: '15.2 MB',
    category: 'Administrative',
    createdBy: 'Jane Adams',
    createdAt: '2025-05-01',
    tags: ['meeting', 'recording', 'team'],
    isShared: true,
    path: '/documents/administration/team_meeting_2025_05_01.mp3',
  },
  {
    id: '10',
    name: 'NHS Compliance Checklist.pdf',
    type: 'pdf',
    size: '980 KB',
    category: 'Compliance',
    createdBy: 'Susan Williams',
    createdAt: '2025-02-10',
    updatedAt: '2025-04-15',
    tags: ['compliance', 'checklist', 'nhs'],
    isShared: true,
    isFavorite: true,
    path: '/documents/compliance/nhs_compliance_checklist.pdf',
  },
];

// PDF File icon component
const PdfFileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-red-500"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <text x="8" y="18" fontSize="6" fontWeight="bold" fill="currentColor">PDF</text>
  </svg>
);

const DocumentCard: React.FC<{ document: Document; onToggleFavorite?: (id: string) => void }> = ({
  document,
  onToggleFavorite,
}) => {
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <PdfFileIcon />;
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'audio':
        return <FileAudio className="h-6 w-6 text-purple-500" />;
      case 'text':
        return <FileText className="h-6 w-6 text-gray-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex space-x-2">
          {getDocumentIcon(document.type)}
          <div>
            <CardTitle className="text-sm font-medium line-clamp-1" title={document.name}>
              {document.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {document.category} • {document.size}
            </CardDescription>
          </div>
        </div>
        <div className="flex">
          {document.isFavorite && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 mr-1">
              Favorite
            </Badge>
          )}
          {document.isShared && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              Shared
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="text-xs text-muted-foreground space-y-1">
          {document.patientName && (
            <div className="flex items-center">
              <UserRound className="h-3 w-3 mr-1" />
              <span>{document.patientName}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <UserRound className="h-3 w-3 mr-1" />
            <span>By: {document.createdBy}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-between items-center">
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" title="View Document">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Download Document">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Share Document">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
            title={document.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={document.isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              className={`h-4 w-4 ${document.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" title="More Options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const FolderCard: React.FC<{ name: string; count: number }> = ({ name, count }) => {
  return (
    <Card className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
      <CardContent className="p-4 flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded">
          <FolderClosed className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground">{count} documents</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<Document['type'] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'folders'>('grid');

  const handleToggleFavorite = (id: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const filteredDocuments = documents.filter(doc => {
    // Filter by search query
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !(doc.patientName && doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Filter by category
    if (selectedCategory && doc.category !== selectedCategory) {
      return false;
    }

    // Filter by type
    if (selectedType && doc.type !== selectedType) {
      return false;
    }

    // Filter by tab
    if (activeTab === 'favorites' && !doc.isFavorite) {
      return false;
    } else if (activeTab === 'shared' && !doc.isShared) {
      return false;
    } else if (activeTab === 'patient' && !doc.patientId) {
      return false;
    } else if (activeTab === 'forms' && doc.category !== 'Forms') {
      return false;
    } else if (activeTab === 'protocols' && doc.category !== 'Protocols') {
      return false;
    }

    return true;
  });

  // Calculate folder structure
  const folders = {
    'Patient Documents': documents.filter(doc => doc.patientId).length,
    'Administrative': documents.filter(doc => doc.category === 'Administrative').length,
    'Forms': documents.filter(doc => doc.category === 'Forms').length,
    'Templates': documents.filter(doc => doc.category === 'Templates').length,
    'Lab Results': documents.filter(doc => doc.category === 'Lab Results').length,
    'Protocols': documents.filter(doc => doc.category === 'Protocols').length,
    'Medical Imaging': documents.filter(doc => doc.category === 'Medical Imaging').length,
    'Reports': documents.filter(doc => doc.category === 'Reports').length,
    'Compliance': documents.filter(doc => doc.category === 'Compliance').length,
  };

  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  const types = Array.from(new Set(documents.map(doc => doc.type)));

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">Documents</h2>
        <p className="text-gray-500 mt-2">Manage and access patient and organizational documents</p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload a new document to the system. Please provide the required metadata.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="patient">Patient (optional)</Label>
                    <Select>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="james">James Wilson</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="robert">Robert Brown</SelectItem>
                        <SelectItem value="mary">Mary Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="e.g. form, admission, report" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shared" />
                    <label
                      htmlFor="shared"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Share with all staff
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setUploadDialogOpen(false)}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex rounded-md border shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'folders' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode('folders')}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6 md:w-auto w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-category" className="whitespace-nowrap text-sm">Category:</Label>
              <Select value={selectedCategory || ''} onValueChange={(value) => setSelectedCategory(value || null)}>
                <SelectTrigger id="filter-category" className="h-8 w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-type" className="whitespace-nowrap text-sm">Type:</Label>
              <Select value={selectedType || ''} onValueChange={(value) => setSelectedType(value as Document['type'] || null)}>
                <SelectTrigger id="filter-type" className="h-8 w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {viewMode === 'folders' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(folders).map(([name, count]) => (
                  <FolderCard key={name} name={name} count={count} />
                ))}
              </div>
            ) : filteredDocuments.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} onToggleFavorite={handleToggleFavorite} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? `No documents matching "${searchQuery}" were found. Try adjusting your search or filters.`
                      : `No documents found in this category. Upload a new document to get started.`}
                  </p>
                  <Button className="mt-4" onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Document
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
