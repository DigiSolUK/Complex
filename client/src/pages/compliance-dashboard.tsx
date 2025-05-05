import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, FileText, Shield, XCircle } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ComplianceArea {
  name: string;
  score: number;
  findings: string[];
  status: 'compliant' | 'at-risk' | 'non-compliant';
  regulation: string;
}

interface ComplianceResult {
  score: number;
  areas: ComplianceArea[];
  recommendations: string[];
  overallStatus: 'compliant' | 'at-risk' | 'non-compliant';
  lastUpdated: Date;
}

export default function ComplianceDashboard() {
  const { toast } = useToast();
  const [selectedArea, setSelectedArea] = useState<ComplianceArea | null>(null);
  
  // Get latest compliance analysis
  const { data: complianceData, isLoading, error } = useQuery<ComplianceResult>({
    queryKey: ['/api/compliance/latest'],
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
  });

  // Mutation to run a new compliance analysis
  const runComplianceAnalysis = useMutation({
    mutationFn: async () => {
      // Gather required data for analysis
      const patientData = await apiRequest('GET', '/api/patients');
      const patientDataJson = await patientData.json();
      
      const carePlanData = await apiRequest('GET', '/api/care-plans');
      const carePlanDataJson = await carePlanData.json();
      
      const appointmentData = await apiRequest('GET', '/api/appointments');
      const appointmentDataJson = await appointmentData.json();
      
      // This would be expanded in a real implementation
      const documentationData = { /* placeholder for now */ };
      
      // Get recent audit logs
      // This would be expanded in a real implementation
      const auditLogs = [];
      
      // Submit data for analysis
      const response = await apiRequest('POST', '/api/compliance/analyze', {
        patientData: patientDataJson,
        carePlanData: carePlanDataJson,
        appointmentData: appointmentDataJson,
        documentationData,
        auditLogs,
      });
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Compliance Analysis Complete',
        description: 'The compliance analysis has been successfully completed.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/latest'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: `There was an error running the compliance analysis: ${error.message}`,
      });
    },
  });

  // Generate compliance report
  const generateReport = useMutation({
    mutationFn: async () => {
      if (!complianceData) {
        throw new Error('No compliance data available');
      }
      
      // Organization info would be fetched in a real implementation
      const organizationInfo = {
        name: 'HealthCare Organization',
        type: 'Primary Care Practice',
        address: '123 Medical Lane',
        contactPerson: 'Jane Smith',
        regulatoryBody: 'NHS Digital',
        registrationNumber: 'HC12345',
      };
      
      const response = await apiRequest('POST', '/api/compliance/generate-report', {
        complianceResult: complianceData,
        organizationInfo,
      });
      
      return await response.json();
    },
    onSuccess: (data) => {
      // In a real implementation, this might download a PDF or open a new window
      // For now, we'll just show a success message
      toast({
        title: 'Report Generated',
        description: 'The compliance report has been generated successfully.',
      });
      
      // Create a download link or display the report
      const element = document.createElement('a');
      const file = new Blob([data.report], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `compliance_report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: `There was an error generating the report: ${error.message}`,
      });
    },
  });

  function getStatusIcon(status: string) {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'non-compliant':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'compliant':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-amber-500';
      case 'non-compliant':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading Compliance Data</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest compliance information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Error Loading Compliance Data</h2>
          <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/compliance/latest'] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage regulatory compliance across all healthcare operations
          </p>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={() => generateReport.mutate()}
            disabled={generateReport.isPending || !complianceData}
          >
            <FileText className="mr-2 h-4 w-4" />
            {generateReport.isPending ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button 
            onClick={() => runComplianceAnalysis.mutate()}
            disabled={runComplianceAnalysis.isPending}
          >
            <Shield className="mr-2 h-4 w-4" />
            {runComplianceAnalysis.isPending ? 'Analyzing...' : 'Run Compliance Analysis'}
          </Button>
        </div>
      </div>

      {complianceData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Compliance Score</CardTitle>
                <CardDescription>
                  Based on latest analysis: {new Date(complianceData.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">{complianceData.score}%</div>
                <Progress value={complianceData.score} className="h-2" />
                <div className="mt-4 flex items-center">
                  {getStatusIcon(complianceData.overallStatus)}
                  <span className="ml-2 capitalize">{complianceData.overallStatus}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Compliance Areas</CardTitle>
                <CardDescription>
                  Breakdown by regulatory category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.areas.map((area, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 rounded-md"
                      onClick={() => setSelectedArea(area)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)} mr-3`}></div>
                        <span>{area.name}</span>
                      </div>
                      <span className="font-semibold">{area.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recommendations</CardTitle>
                <CardDescription>
                  Actions to improve compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {complianceData.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {selectedArea && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedArea.name}</CardTitle>
                  <div className="flex items-center">
                    {getStatusIcon(selectedArea.status)}
                    <span className="ml-2 capitalize">{selectedArea.status}</span>
                  </div>
                </div>
                <CardDescription>
                  Compliance score: {selectedArea.score}% - Regulation: {selectedArea.regulation}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Findings</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedArea.findings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-muted/50 border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedArea(null)}>
                  Close Details
                </Button>
              </CardFooter>
            </Card>
          )}

          <Tabs defaultValue="standards">
            <TabsList className="mb-4">
              <TabsTrigger value="standards">Compliance Standards</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Compliance</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standards">
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Compliance Standards</CardTitle>
                  <CardDescription>
                    Key regulatory standards and requirements applicable to this organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">NHS Digital Standards</h3>
                      <p className="text-muted-foreground mb-4">
                        Standards for digital health services within the NHS ecosystem.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-1">Information Governance</h4>
                          <p className="text-sm text-muted-foreground">Data handling, security, and access control protocols.</p>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-1">Interoperability Standards</h4>
                          <p className="text-sm text-muted-foreground">Requirements for system connectivity and data exchange.</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
                      <p className="text-muted-foreground mb-4">
                        Requirements for protecting patient data and ensuring privacy.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-1">UK GDPR Compliance</h4>
                          <p className="text-sm text-muted-foreground">Data protection requirements specific to healthcare.</p>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-1">Data Processing Agreements</h4>
                          <p className="text-sm text-muted-foreground">Requirements for third-party data processors.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Compliance</CardTitle>
                  <CardDescription>
                    Analysis and monitoring of privacy controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    This section would contain privacy compliance analysis and monitoring tools.
                    Implement integration with <code>/api/compliance/privacy-analysis</code> endpoint.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Documentation</CardTitle>
                  <CardDescription>
                    Generate and manage regulatory documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    This section would contain tools to generate regulatory documentation.
                    Implement integration with <code>/api/compliance/generate-documentation</code> endpoint.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No Compliance Data Available</CardTitle>
            <CardDescription>
              Run a compliance analysis to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="mb-6">No compliance analysis has been run yet. Run an analysis to evaluate your organization's regulatory compliance status.</p>
            <Button 
              onClick={() => runComplianceAnalysis.mutate()}
              disabled={runComplianceAnalysis.isPending}
              size="lg"
            >
              {runComplianceAnalysis.isPending ? 'Analyzing...' : 'Run Initial Compliance Analysis'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
