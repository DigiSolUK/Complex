import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, FileText, Activity, PieChart, RefreshCw, Zap, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1', '#a4de6c'];

export default function AnalyticsTool() {
  const [tab, setTab] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [analysisGenerated, setAnalysisGenerated] = useState(true);

  const handleGenerateAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalysisGenerated(true);
    }, 2000);
  };

  const patientData = [
    { name: 'Jan', value: 24 },
    { name: 'Feb', value: 32 },
    { name: 'Mar', value: 38 },
    { name: 'Apr', value: 30 },
    { name: 'May', value: 35 },
    { name: 'Jun', value: 42 },
    { name: 'Jul', value: 45 },
    { name: 'Aug', value: 50 },
    { name: 'Sep', value: 48 },
    { name: 'Oct', value: 52 },
    { name: 'Nov', value: 58 },
    { name: 'Dec', value: 62 },
  ];

  const appointmentData = [
    { name: 'Jan', value: 54 },
    { name: 'Feb', value: 62 },
    { name: 'Mar', value: 68 },
    { name: 'Apr', value: 70 },
    { name: 'May', value: 75 },
    { name: 'Jun', value: 82 },
    { name: 'Jul', value: 85 },
    { name: 'Aug', value: 90 },
    { name: 'Sep', value: 88 },
    { name: 'Oct', value: 92 },
    { name: 'Nov', value: 98 },
    { name: 'Dec', value: 102 },
  ];

  const careTypeData = [
    { name: 'Home Care', value: 45 },
    { name: 'Residential', value: 25 },
    { name: 'Day Centre', value: 15 },
    { name: 'Hospice', value: 10 },
    { name: 'Respite', value: 5 },
  ];

  const KPICard = ({ title, value, description, progress, total }: { title: string, value: number, description: string, progress?: number, total?: number }) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {progress !== undefined && total !== undefined && (
            <Progress 
              value={progress} 
              max={total} 
              className="h-1 mt-2" 
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/tools">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">AI Analytics</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Data Analysis Dashboard</h2>
          <p className="text-muted-foreground">
            AI-powered insights and predictive analytics for healthcare management.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={handleGenerateAnalysis} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            Generate Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard 
          title="Total Patients" 
          value={185} 
          description="+12.3% from last month" 
          progress={185} 
          total={250} 
        />
        <KPICard 
          title="Active Care Plans" 
          value={142} 
          description="76.8% of total patients" 
          progress={142} 
          total={185} 
        />
        <KPICard 
          title="Appointments This Month" 
          value={358} 
          description="+5.2% from last month" 
        />
        <KPICard 
          title="Avg. Satisfaction" 
          value={4.8} 
          description="+0.2 from last month" 
          progress={4.8} 
          total={5} 
        />
      </div>

      <Tabs defaultValue="patient" className="space-y-4" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="patient" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Patient Analytics
          </TabsTrigger>
          <TabsTrigger value="care" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Care Analytics
          </TabsTrigger>
          <TabsTrigger value="operational" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Operational Insights
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Predictive Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Trend</CardTitle>
                <CardDescription>Monthly patient growth over the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#0088FE" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Care Type Distribution</CardTitle>
                <CardDescription>Distribution of patients by care type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={careTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {careTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Patient Insights</CardTitle>
              <CardDescription>Automatically generated insights based on patient data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Patient Demographics Analysis</h3>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    The patient population is growing steadily with a notable increase of 12.3% in the last month. 
                    The majority of patients (45%) are in home care services, with residential care representing 25% of the patient base.
                    There's an opportunity to expand day centre services which represent only 15% of current care provision.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Patient Satisfaction Trends</h3>
                  <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                    Patient satisfaction scores are consistently high at 4.8/5, with a small improvement of 0.2 points from the previous month. 
                    The main factors contributing to high satisfaction are staff friendliness, care quality, and appointment availability. 
                    Areas for improvement include the intake process and medication management support.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Patient Engagement Opportunities</h3>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                    Analysis indicates that 22% of patients would benefit from additional digital engagement tools. 
                    Implementing a medication reminder system could improve medication adherence by an estimated 18% for patients managing 3+ medications. 
                    Targeted outreach to the 35 patients who have missed follow-up appointments could improve care continuity metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>Monthly appointment volume over the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00C49F" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Care Plan Effectiveness</CardTitle>
                <CardDescription>Care plan outcomes by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Mobility Improvement</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} max={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Medication Adherence</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} max={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Mental Health Status</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <Progress value={62} max={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Pain Management</span>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                    <Progress value={70} max={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Independent Living Skills</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} max={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Care Insights</CardTitle>
              <CardDescription>Automatically generated insights based on care delivery data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Care Plan Effectiveness</h3>
                  <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                    Care plans focusing on medication adherence show the highest success rate at 88%. 
                    Mobility improvement programs have shown consistent progress with 75% of patients meeting their defined goals. 
                    Mental health interventions show the most variability in outcomes with 62% overall effectiveness, suggesting an opportunity for more personalized approaches.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Appointment Optimization</h3>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    Appointment volume has grown steadily throughout the year, with December showing a 102% increase compared to January. 
                    The current no-show rate of 8% is below industry average but could be further improved through targeted reminder systems. 
                    Data suggests that offering more appointment slots on Tuesdays and Thursdays would better match patient preferences.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Care Delivery Recommendations</h3>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                    Analysis of patient outcomes suggests that increasing visit frequency for mental health support from monthly to bi-weekly could improve outcomes by an estimated 15%. 
                    Integrating dietary guidance with medication management could reduce adverse medication effects reported by 22% of patients. 
                    Data supports expanding the pain management program with additional non-pharmacological interventions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Operational Efficiency Metrics</CardTitle>
                <CardDescription>Key efficiency indicators for care delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Staff Utilization</h3>
                    <div className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">85%</div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">+5% from previous month</p>
                  </div>
                  
                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900">
                    <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Care Plan Completion</h3>
                    <div className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">78%</div>
                    <p className="text-xs text-green-600 dark:text-green-400">+3% from previous month</p>
                  </div>
                  
                  <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900">
                    <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">Documentation Compliance</h3>
                    <div className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">92%</div>
                    <p className="text-xs text-amber-600 dark:text-amber-400">+2% from previous month</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-4">Resource Utilization</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Staff Time Allocation</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} max={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Equipment Utilization</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <Progress value={72} max={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Facility Usage</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} max={100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Operational Insights</CardTitle>
                <CardDescription>Automatically generated insights to improve operational efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Staff Allocation Optimization</h3>
                    <p className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                      Staff utilization has improved to 85%, but analysis indicates uneven workload distribution. 
                      Reallocating 3 staff members from administrative duties to direct care during peak hours (10am-2pm) could improve patient wait times by an estimated 25%. 
                      Cross-training 5 staff members in medication management could reduce specialist bottlenecks.
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Resource Efficiency</h3>
                    <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                      Equipment utilization at 72% indicates potential for better scheduling. 
                      Implementing a centralized equipment reservation system could increase utilization to an estimated 85% and reduce procurement needs. 
                      Facility usage patterns show opportunity to repurpose underutilized spaces (Rooms 102, 108, and 115) for additional care services or community programs.
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Process Improvement Opportunities</h3>
                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                      Documentation compliance has reached 92%, with the remaining gaps mostly in care plan updates and specialized assessments. 
                      Automating routine documentation through templates could save an estimated 45 minutes per staff member per day. 
                      Data shows that implementing a streamlined intake process could reduce onboarding time for new patients by 40%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Predictive Insights</CardTitle>
              <CardDescription>Forward-looking analysis based on historical data patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100 dark:border-blue-900">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Patient Population Forecast</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Based on current growth trends and demographic analysis, the patient population is projected to increase by 24% over the next 12 months. 
                    The most significant growth is expected in the 65-80 age group (+32%) and in patients requiring chronic condition management (+28%). 
                    Geographic data suggests expanding services in the northwestern district could capture an additional 45-60 patients currently underserved.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Confidence Level: 92%</h4>
                    <Progress value={92} max={100} className="h-2" />
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-100 dark:border-purple-900">
                  <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Care Needs Prediction</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    Predictive modeling indicates a 35% increase in demand for mental health services over the next 6 months, particularly among the 25-45 age demographic. 
                    Seasonal analysis suggests preparing for a 22% increase in respiratory-related care needs beginning in October. 
                    Patient progression patterns indicate that 18 current home care patients will likely transition to residential care within 3-4 months.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Confidence Level: 87%</h4>
                    <Progress value={87} max={100} className="h-2" />
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-100 dark:border-amber-900">
                  <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">Resource Planning Projection</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-200">
                    Staff capacity analysis indicates the need to hire 3-4 additional care professionals within the next 4 months to maintain optimal care ratios. 
                    Equipment utilization forecasts suggest investing in 2 additional mobility assistance devices and upgrading the medication dispensing system by Q3. 
                    Facility space projection shows the current location will reach 90% capacity by November, suggesting initiating expansion planning.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Confidence Level: 84%</h4>
                    <Progress value={84} max={100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                These predictions are generated using advanced machine learning models trained on historical healthcare data and industry benchmarks. Predictions are updated weekly with new data.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      
      <div className="text-sm text-muted-foreground">
        <p>AI analytics powered by ComplexCare's machine learning models. Data is updated daily from all care management systems. For methodology details or custom analytics, please contact the data science team.</p>
      </div>
    </div>
  );
}
