import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle, XCircle, FileSearch, Download, ClipboardList, Info, PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ComplianceArea {
  name: string;
  score: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  issues: string[];
  recommendations: string[];
}

const ComplianceScoreCard = ({ score }: { score: number }) => {
  const getColorClass = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusText = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-base font-medium">Overall Compliance Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-5xl font-bold ${getColorClass(score)}`}>{score}%</div>
        <div className={`text-sm font-medium mt-2 ${getColorClass(score)}`}>
          {getStatusText(score)}
        </div>
        <Progress
          value={score}
          max={100}
          className="h-2 mt-4"
          indicatorClassName={`${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline" size="sm">
          <FileSearch className="h-4 w-4 mr-2" />
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};

const ComplianceAreaCard = ({ area }: { area: ComplianceArea }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Compliant';
      case 'warning':
        return 'Needs Attention';
      case 'non-compliant':
        return 'Non-Compliant';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'non-compliant':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getStatusIcon(area.status)}
            <CardTitle className="text-base font-medium">{area.name}</CardTitle>
          </div>
          <Badge className={getStatusClass(area.status)}>
            {getStatusText(area.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Compliance Score</span>
            <span className="text-sm font-semibold">{area.score}%</span>
          </div>
          <Progress
            value={area.score}
            max={100}
            className="h-2"
            indicatorClassName={`${area.score >= 90 ? 'bg-green-500' : area.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
          />
          {expanded && (
            <div className="mt-4 space-y-4">
              {area.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Issues Identified:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {area.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {area.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {area.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs h-8"
        >
          {expanded ? 'Show Less' : 'Show Details'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ComplianceTool() {
  // Sample compliance data
  const complianceData = {
    score: 83,
    lastUpdated: '2025-05-05',
    areas: [
      {
        name: 'Data Security',
        score: 92,
        status: 'compliant',
        issues: [],
        recommendations: [
          'Conduct quarterly security training for all staff',
          'Continue regular security audits'
        ],
      },
      {
        name: 'HIPAA Compliance',
        score: 87,
        status: 'compliant',
        issues: [
          'Minor documentation gaps in access logs'
        ],
        recommendations: [
          'Update access log monitoring procedures',
          'Schedule HIPAA refresher training for all staff'
        ],
      },
      {
        name: 'Patient Consent Management',
        score: 76,
        status: 'warning',
        issues: [
          'Some consent forms outdated',
          'Inconsistent consent tracking process'
        ],
        recommendations: [
          'Update all consent forms to latest templates',
          'Implement digital consent tracking system',
          'Conduct staff training on consent procedures'
        ],
      },
      {
        name: 'Access Controls',
        score: 94,
        status: 'compliant',
        issues: [],
        recommendations: [
          'Continue regular access reviews',
          'Consider implementing multi-factor authentication for all systems'
        ],
      },
      {
        name: 'Data Retention Policy',
        score: 65,
        status: 'warning',
        issues: [
          'Inconsistent implementation of retention schedules',
          'Some historical data exceeds retention period',
          'Manual processes prone to error'
        ],
        recommendations: [
          'Implement automated data retention system',
          'Conduct audit of historical data',
          'Update data retention policy documentation'
        ],
      },
      {
        name: 'Third-Party Vendor Management',
        score: 59,
        status: 'non-compliant',
        issues: [
          'Several vendors lack updated BAAs',
          'Inadequate vendor security assessments',
          'Vendor access not properly monitored'
        ],
        recommendations: [
          'Update all Business Associate Agreements',
          'Implement formal vendor security assessment process',
          'Restrict and monitor vendor system access',
          'Designate vendor management coordinator'
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/tools">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Analyzer</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Healthcare Compliance Dashboard</h2>
          <p className="text-muted-foreground">
            AI-powered analysis of regulatory compliance status and recommendations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Run New Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ComplianceScoreCard score={complianceData.score} />
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
              <CardDescription>
                Last updated: {complianceData.lastUpdated} - AI-powered compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-100 dark:border-green-900 flex items-center space-x-3">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">Compliant Areas</div>
                      <div className="text-2xl font-bold">{complianceData.areas.filter(a => a.status === 'compliant').length}</div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-100 dark:border-amber-900 flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                    <div>
                      <div className="text-sm font-medium">Warning Areas</div>
                      <div className="text-2xl font-bold">{complianceData.areas.filter(a => a.status === 'warning').length}</div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-100 dark:border-red-900 flex items-center space-x-3">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-sm font-medium">Non-Compliant Areas</div>
                      <div className="text-2xl font-bold">{complianceData.areas.filter(a => a.status === 'non-compliant').length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Key Actions Required
                  </h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Update all Business Associate Agreements with third-party vendors</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Implement automated data retention system to enforce policy</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Update patient consent forms and tracking procedures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="areas">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="areas">Compliance Areas</TabsTrigger>
          <TabsTrigger value="reports">Detailed Reports</TabsTrigger>
          <TabsTrigger value="trends">Compliance Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="areas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceData.areas.map((area, index) => (
              <ComplianceAreaCard key={index} area={area as ComplianceArea} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Detailed compliance assessment reports and documentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/60" />
                <div>
                  <h3 className="text-lg font-medium">Detailed Reports</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section will contain detailed compliance reports, including audit trails,
                    assessment documentation, and regulatory filings.
                  </p>
                </div>
                <Button>
                  View All Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>
                Historical compliance performance trends and analytics.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <PieChart className="h-16 w-16 mx-auto text-muted-foreground/60" />
                <div>
                  <h3 className="text-lg font-medium">Compliance Trends</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section will display historical compliance performance data and analytics,
                    showing trends over time and progress against compliance goals.
                  </p>
                </div>
                <Button>
                  Analyze Trends
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      
      <div className="text-sm text-muted-foreground">
        <p>This compliance analysis is generated using AI-powered assessment tools and regulatory frameworks including HIPAA, GDPR, and healthcare industry best practices. The analysis should be reviewed by qualified compliance professionals before taking action.</p>
      </div>
    </div>
  );
}
