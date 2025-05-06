import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BasicReport } from "@/components/reports/basic-report";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, FileDown, RefreshCw, UserCog, FileText, Activity, PieChart, Users, HeartPulse, Building } from "lucide-react";

export default function Reports() {
  const { isDemoMode } = useAuth();
  const [reportType, setReportType] = useState("patient-summary");
  const [reportCategory, setReportCategory] = useState("patient");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch report data
  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: [`/api/reports/${reportType}`, { startDate, endDate }],
    enabled: !isDemoMode && isGenerating,
  });

  // Demo data for reports
  const demoReports = {
    "patient-summary": {
      title: "Patient Summary Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalPatients: 124,
        newPatients: 15,
        activePatients: 98,
        inactivePatients: 26,
      },
      byStatus: [
        { name: "Active", value: 98 },
        { name: "Inactive", value: 11 },
        { name: "Review", value: 9 },
        { name: "New", value: 6 },
      ],
      byCareType: [
        { name: "Home Care", value: 75 },
        { name: "Day Care", value: 28 },
        { name: "Residential", value: 21 },
      ],
    },
    "patient-demographics": {
      title: "Patient Demographics Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalPatients: 124,
        malePatients: 52,
        femalePatients: 70,
        nonBinaryPatients: 2,
      },
      byAgeGroup: [
        { name: "0-18", value: 8 },
        { name: "19-35", value: 17 },
        { name: "36-50", value: 24 },
        { name: "51-65", value: 31 },
        { name: "66-80", value: 35 },
        { name: "81+", value: 9 },
      ],
      byLocation: [
        { name: "London", value: 48 },
        { name: "Manchester", value: 23 },
        { name: "Birmingham", value: 17 },
        { name: "Liverpool", value: 15 },
        { name: "Other", value: 21 },
      ],
    },
    "appointment-analysis": {
      title: "Appointment Analysis Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalAppointments: 312,
        completed: 245,
        cancelled: 35,
        pending: 32,
      },
      byStatus: [
        { name: "Completed", value: 245 },
        { name: "Cancelled", value: 35 },
        { name: "Pending", value: 32 },
      ],
      byDayOfWeek: [
        { name: "Monday", value: 63 },
        { name: "Tuesday", value: 73 },
        { name: "Wednesday", value: 68 },
        { name: "Thursday", value: 59 },
        { name: "Friday", value: 49 },
      ],
    },
    "patient-activity": {
      title: "Patient Activity Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalInteractions: 487,
        appointments: 312,
        messagingThreads: 98,
        documentViews: 77,
      },
      byInteractionType: [
        { name: "In-person", value: 232 },
        { name: "Telemedicine", value: 80 },
        { name: "Messaging", value: 98 },
        { name: "Document", value: 77 },
      ],
      byTimeOfDay: [
        { name: "Morning", value: 203 },
        { name: "Afternoon", value: 168 },
        { name: "Evening", value: 116 },
      ],
    },
    "care-plan-metrics": {
      title: "Care Plan Metrics Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalPlans: 87,
        activePlans: 65,
        completedPlans: 12,
        draftPlans: 10,
      },
      byStatus: [
        { name: "Active", value: 65 },
        { name: "Completed", value: 12 },
        { name: "Draft", value: 10 },
      ],
      byReviewFrequency: [
        { name: "Monthly", value: 42 },
        { name: "Quarterly", value: 31 },
        { name: "Bi-annually", value: 9 },
        { name: "Annually", value: 5 },
      ],
    },
    "care-plan-progress": {
      title: "Care Plan Progress Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalPlans: 87,
        completionRate: "76%",
        averageGoalsPerPlan: 4.2,
        goalsAchieved: 158,
      },
      byCompletionRate: [
        { name: "0-25%", value: 12 },
        { name: "26-50%", value: 18 },
        { name: "51-75%", value: 23 },
        { name: "76-99%", value: 22 },
        { name: "100%", value: 12 },
      ],
      byPatientOutcome: [
        { name: "Significant Improvement", value: 31 },
        { name: "Moderate Improvement", value: 35 },
        { name: "Minimal Change", value: 15 },
        { name: "Declined", value: 6 },
      ],
    },
    "staff-activity": {
      title: "Staff Activity Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalStaff: 32,
        activeStaff: 28,
        onLeaveStaff: 3,
        inactiveStaff: 1,
      },
      byDepartment: [
        { name: "General Practice", value: 8 },
        { name: "Community Nursing", value: 12 },
        { name: "Administration", value: 5 },
        { name: "Rehabilitation", value: 4 },
        { name: "Geriatrics", value: 3 },
      ],
      topActivityByStaff: [
        { name: "Dr. Mark Thompson", value: 87 },
        { name: "Nurse Lisa Chen", value: 73 },
        { name: "Dr. James Wilson", value: 65 },
        { name: "Sarah Johnson", value: 58 },
        { name: "Michael Brown", value: 42 },
      ],
    },
    "medication-compliance": {
      title: "Medication Compliance Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalPatients: 124,
        highCompliance: 87,
        mediumCompliance: 28,
        lowCompliance: 9,
      },
      byComplianceScore: [
        { name: "90-100%", value: 87 },
        { name: "70-89%", value: 28 },
        { name: "Below 70%", value: 9 },
      ],
      byMedicationType: [
        { name: "Cardiovascular", value: 92 },
        { name: "Respiratory", value: 78 },
        { name: "Pain Management", value: 88 },
        { name: "Mental Health", value: 72 },
        { name: "Diabetes", value: 86 },
      ],
    },
    "patient-satisfaction": {
      title: "Patient Satisfaction Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalResponses: 96,
        averageRating: "4.3/5",
        promoterScore: "82%",
        feedbackReceived: 78,
      },
      byCategory: [
        { name: "Staff Interaction", value: 4.6 },
        { name: "Treatment Quality", value: 4.5 },
        { name: "Facilities", value: 4.1 },
        { name: "Communication", value: 4.2 },
        { name: "Appointment Process", value: 3.9 },
      ],
      byRecommendation: [
        { name: "Definitely", value: 62 },
        { name: "Likely", value: 24 },
        { name: "Maybe", value: 7 },
        { name: "Unlikely", value: 3 },
      ],
    },
    "patient-referrals": {
      title: "Patient Referrals Report",
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      summary: {
        totalReferrals: 68,
        incomingReferrals: 42,
        outgoingReferrals: 26,
        conversionRate: "76%",
      },
      byReferralSource: [
        { name: "GP Practices", value: 22 },
        { name: "Hospitals", value: 15 },
        { name: "Community Services", value: 10 },
        { name: "Self-referral", value: 8 },
        { name: "Social Services", value: 13 },
      ],
      byConversion: [
        { name: "Converted", value: 52 },
        { name: "Pending", value: 11 },
        { name: "Declined", value: 5 },
      ],
    },
  };

  // Use real or demo data
  const displayReportData = isDemoMode 
    ? demoReports[reportType as keyof typeof demoReports] 
    : reportData;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    if (!isDemoMode) {
      refetch();
    }
  };

  const handleExportReport = () => {
    // In a real implementation, this would trigger a download of the report data
    alert("Export functionality would be implemented here");
  };

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Reports
        </h2>
        <p className="text-gray-500 mt-2">Generate and download comprehensive reports</p>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="patient" className="w-full" onValueChange={setReportCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="patient" className="flex items-center"><Users className="mr-2 h-4 w-4" /> Patient Reports</TabsTrigger>
            <TabsTrigger value="clinical" className="flex items-center"><HeartPulse className="mr-2 h-4 w-4" /> Clinical Reports</TabsTrigger>
            <TabsTrigger value="operational" className="flex items-center"><Activity className="mr-2 h-4 w-4" /> Operational Reports</TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center"><Building className="mr-2 h-4 w-4" /> Financial Reports</TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center"><FileText className="mr-2 h-4 w-4" /> Custom Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Patient Demographics
                </CardTitle>
                <p className="text-sm text-gray-500">Comprehensive breakdown of patient demographics including age, gender, and location.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("patient-demographics"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Patient Activity
                </CardTitle>
                <p className="text-sm text-gray-500">Summary of patient interactions, appointments, and engagement metrics.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("patient-activity"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Patient Satisfaction
                </CardTitle>
                <p className="text-sm text-gray-500">Analysis of patient feedback and satisfaction metrics.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("patient-satisfaction"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Referrals
                </CardTitle>
                <p className="text-sm text-gray-500">Summary of patient referral sources and conversion rates.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("patient-referrals"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clinical" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5" />
                  Care Plan Metrics
                </CardTitle>
                <p className="text-sm text-gray-500">Analysis of active care plans and their effectiveness.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("care-plan-metrics"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Care Plan Progress
                </CardTitle>
                <p className="text-sm text-gray-500">Detailed progression of care plans and patient outcomes.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("care-plan-progress"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Medication Compliance
                </CardTitle>
                <p className="text-sm text-gray-500">Patient medication adherence and compliance metrics.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("medication-compliance"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Clinical Outcomes
                </CardTitle>
                <p className="text-sm text-gray-500">Results and outcomes of treatment plans and interventions.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("clinical-outcomes"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="operational" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Activity
                </CardTitle>
                <p className="text-sm text-gray-500">Comprehensive analysis of staff activity and productivity.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("staff-activity"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Appointment Analysis
                </CardTitle>
                <p className="text-sm text-gray-500">Detailed analysis of appointments, cancellations, and scheduling patterns.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("appointment-analysis"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Resource Utilization
                </CardTitle>
                <p className="text-sm text-gray-500">Analysis of facility and resource usage and efficiency.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("resource-utilization"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  System Usage
                </CardTitle>
                <p className="text-sm text-gray-500">Metrics on system usage, login patterns, and feature utilization.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("system-usage"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Revenue Analysis
                </CardTitle>
                <p className="text-sm text-gray-500">Comprehensive breakdown of revenue streams and financial performance.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("revenue-analysis"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Billing Analysis
                </CardTitle>
                <p className="text-sm text-gray-500">Detailed analysis of billing, payments, and outstanding invoices.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("billing-analysis"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Service Cost Analysis
                </CardTitle>
                <p className="text-sm text-gray-500">Cost breakdown by service type and operational expenses.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("service-cost-analysis"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Financial Forecasting
                </CardTitle>
                <p className="text-sm text-gray-500">Predictive analysis of future financial performance and trends.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="justify-start" onClick={() => { setReportType("financial-forecasting"); handleGenerateReport(); }}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <p className="text-sm text-gray-500">Create tailored reports by selecting specific data fields and parameters.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Title</label>
                    <Input placeholder="Enter report title" className="max-w-md" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Category</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patients">Patients</SelectItem>
                          <SelectItem value="appointments">Appointments</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="care-plans">Care Plans</SelectItem>
                          <SelectItem value="medications">Medications</SelectItem>
                          <SelectItem value="billing">Billing & Financials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary Report</SelectItem>
                          <SelectItem value="detailed">Detailed Report</SelectItem>
                          <SelectItem value="trend">Trend Analysis</SelectItem>
                          <SelectItem value="comparison">Comparison Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input 
                        type="date" 
                        className="w-full" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input 
                        type="date" 
                        className="w-full"
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="mr-2" onClick={() => { setReportType("custom-report"); handleGenerateReport(); }}>
                      <BarChart2 className="mr-2 h-4 w-4" /> Generate Custom Report
                    </Button>
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" /> Save Report Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saved Report Templates</CardTitle>
                <p className="text-sm text-gray-500">Your previously saved custom report configurations.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Quarterly Patient Demographics</h3>
                        <p className="text-sm text-muted-foreground">Created on May 2, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load Template
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Staff Performance Analysis</h3>
                        <p className="text-sm text-muted-foreground">Created on April 28, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load Template
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Monthly Revenue Breakdown</h3>
                        <p className="text-sm text-muted-foreground">Created on April 15, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isLoading && !isDemoMode ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <span className="ml-2">Generating report...</span>
        </div>
      ) : displayReportData ? (
        <div className="mt-6">
          <BasicReport data={displayReportData} />
        </div>
      ) : isGenerating ? (
        <div className="flex justify-center items-center h-64">
          <p>No data available for the selected period</p>
        </div>
      ) : null}
    </div>
  );
}
