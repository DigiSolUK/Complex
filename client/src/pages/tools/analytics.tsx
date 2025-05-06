import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileBarChart, Download, TrendingUp, TrendingDown, Users, AlertTriangle, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AnalyticsCard = ({
  title,
  value,
  change,
  trend,
  description,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : trend === 'down' ? (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          ) : null}
          <span
            className={`text-sm ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : ''}`}
          >
            {change}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </CardContent>
    </Card>
  );
};

const RiskCard = ({
  patientName,
  riskScore,
  riskLevel,
  factors,
}: {
  patientName: string;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  factors: string[];
}) => {
  const getColorByRiskLevel = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-300';
      case 'medium':
        return 'text-amber-500 bg-amber-100 dark:bg-amber-950 dark:text-amber-300';
      case 'low':
        return 'text-green-500 bg-green-100 dark:bg-green-950 dark:text-green-300';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{patientName}</CardTitle>
          <div
            className={`px-2 py-1 rounded text-xs font-medium uppercase ${getColorByRiskLevel(
              riskLevel
            )}`}
          >
            {riskLevel} risk
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Risk Score</span>
            <span className="text-sm font-semibold">{riskScore}/100</span>
          </div>
          <Progress
            value={riskScore}
            max={100}
            className={`h-2 ${riskLevel === 'high' ? 'bg-red-100' : riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}
            indicatorClassName={`${riskLevel === 'high' ? 'bg-red-500' : riskLevel === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}
          />
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Key Risk Factors:</h4>
            <ul className="text-xs space-y-1">
              {factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-2">
        <Button size="sm" variant="ghost" className="w-full text-xs h-8">
          View Patient Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AnalyticsTool() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/tools">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">AI Analytics Dashboard</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Predictive Insights</h2>
          <p className="text-muted-foreground">
            AI-powered analytics to help identify trends and predict patient outcomes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileBarChart className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Readmission Risk"
          value="14.2%"
          change="-2.3% vs last month"
          trend="down"
          description="Predicted 30-day readmission rate"
        />
        <AnalyticsCard
          title="Medication Adherence"
          value="78%"
          change="+5.4% vs last month"
          trend="up"
          description="Percentage of patients following prescriptions"
        />
        <AnalyticsCard
          title="Average Recovery Time"
          value="18.5 days"
          change="-1.2 days vs last month"
          trend="down"
          description="For post-surgical patients"
        />
        <AnalyticsCard
          title="High-Risk Patients"
          value="24"
          change="+3 vs last month"
          trend="up"
          description="Patients requiring immediate intervention"
        />
      </div>

      <Tabs defaultValue="risk">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="risk">Risk Prediction</TabsTrigger>
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="population">Population Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Risk Analysis</CardTitle>
              <CardDescription>
                AI-identified patients with elevated health risks requiring attention.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <RiskCard
                  patientName="James Wilson"
                  riskScore={87}
                  riskLevel="high"
                  factors={[
                    'Missed last 2 appointments',
                    'Decreasing kidney function',
                    'Medication adherence below 60%',
                  ]}
                />
                <RiskCard
                  patientName="Sarah Thompson"
                  riskScore={72}
                  riskLevel="high"
                  factors={[
                    'Elevated A1C levels',
                    'Recent hospital admission',
                    'Multiple medication changes',
                  ]}
                />
                <RiskCard
                  patientName="Michael Chen"
                  riskScore={64}
                  riskLevel="medium"
                  factors={[
                    'Blood pressure fluctuations',
                    'Family history of cardiac issues',
                    'Stress-related symptoms',
                  ]}
                />
                <RiskCard
                  patientName="Emily Rodriguez"
                  riskScore={58}
                  riskLevel="medium"
                  factors={[
                    'Recent weight loss',
                    'Reported sleep difficulties',
                    'Inconsistent follow-up',
                  ]}
                />
                <RiskCard
                  patientName="David Nguyen"
                  riskScore={42}
                  riskLevel="medium"
                  factors={[
                    'Mild respiratory symptoms',
                    'Medication side effects',
                    'Limited social support',
                  ]}
                />
                <RiskCard
                  patientName="Linda Johnson"
                  riskScore={28}
                  riskLevel="low"
                  factors={[
                    'Stable vital signs',
                    'Minor mobility limitations',
                    'Consistent appointment attendance',
                  ]}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View All Patients
              </Button>
              <Button>
                <BarChart className="h-4 w-4 mr-2" />
                Generate Risk Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Health Trend Analysis</CardTitle>
              <CardDescription>
                Visualization of key health metrics and trends over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <BarChart className="h-16 w-16 mx-auto text-muted-foreground/60" />
                <div>
                  <h3 className="text-lg font-medium">Health Trends Visualization</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section will display interactive charts showing patient health trends,
                    including vital signs, lab results, and key health indicators over time.
                  </p>
                </div>
                <Button>
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="population">
          <Card>
            <CardHeader>
              <CardTitle>Population Health Insights</CardTitle>
              <CardDescription>
                Aggregate health analytics across patient populations.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <Users className="h-16 w-16 mx-auto text-muted-foreground/60" />
                <div>
                  <h3 className="text-lg font-medium">Population Analytics</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section will provide insights into population health management,
                    including demographic analysis, disease prevalence, and intervention
                    effectiveness metrics.
                  </p>
                </div>
                <Button>
                  Explore Population Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground border-t pt-4">
        <p>All predictions are generated using anonymized patient data and advanced machine learning models. These insights should be used as supportive tools for clinical decision-making, not as replacements for professional medical judgment.</p>
      </div>
    </div>
  );
}
