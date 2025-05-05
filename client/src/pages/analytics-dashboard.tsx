import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CalendarIcon, FileDown } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AnalyticsDashboard() {
  const { isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState("patient");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 4, 5), // May 5, 2025
    to: new Date(2025, 4, 12), // May 12, 2025
  });

  // KPI metrics
  const kpiData = {
    totalPatients: {
      value: 246,
      change: "+15% from last month"
    },
    patientSatisfaction: {
      value: "92%",
      change: "+2% from last month"
    },
    carePlanCompletion: {
      value: "84%",
      change: "+5% from last month"
    },
    missedAppointments: {
      value: "4.2%",
      change: "-0.3% from last month"
    }
  };

  // Age distribution data
  const ageDistributionData = [
    { age: "0-17", count: 12 },
    { age: "18-24", count: 28 },
    { age: "25-34", count: 45 },
    { age: "35-44", count: 56 },
    { age: "45-59", count: 38 },
    { age: "60+", count: 21 },
  ];

  // Main conditions data
  const conditionsData = [
    { name: "Hypertension", value: 25, color: "#4ade80" },
    { name: "Diabetes", value: 20, color: "#60a5fa" },
    { name: "Heart Disease", value: 14, color: "#facc15" },
    { name: "Respiratory", value: 9, color: "#fb923c" },
    { name: "Mental Health", value: 16, color: "#c084fc" },
    { name: "Other", value: 16, color: "#f43f5e" },
  ];

  // Referral sources data
  const referralData = [
    { name: "GP Referral", value: 95 },
    { name: "Hospital", value: 68 },
    { name: "Self-Referral", value: 45 },
    { name: "Social Services", value: 32 },
    { name: "Other healthcare", value: 18 },
  ];

  // AI Insights data
  const patientEngagementInsight = {
    title: "Patient Engagement",
    description: "Based on patient activity patterns",
    content: "Patients with chronic conditions show higher engagement when assigned weekly check-ins compared to monthly ones. Consider adjusting care plans accordingly.",
    cta: "View Detailed Analysis",
    link: "/reports/patient-engagement"
  };

  const riskStratificationInsight = {
    title: "Risk Stratification",
    description: "Based on clinical data trends",
    content: "15 patients currently show elevated risk scores for readmission. Early intervention recommended for patients with IDs: PID42, PD75, PID3.",
    cta: "View At-Risk Patients",
    link: "/reports/risk-patients"
  };

  const resourceOptimizationInsight = {
    title: "Resource Optimization",
    description: "Based on operational data",
    content: "Wednesday mornings show consistently low appointment utilization. Consider reallocating staff or adding specialty appointments in this time slot.",
    cta: "View Schedule Analysis",
    link: "/reports/schedule-optimization"
  };

  const handleExportReports = () => {
    alert("Export functionality would download analytics data as CSV/PDF");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and reporting</p>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleExportReports}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalPatients.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpiData.totalPatients.change}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.patientSatisfaction.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpiData.patientSatisfaction.change}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Care Plan Completion</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.carePlanCompletion.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpiData.carePlanCompletion.change}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Missed Appointments</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.missedAppointments.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpiData.missedAppointments.change}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="patient">Patient Analytics</TabsTrigger>
          <TabsTrigger value="appointment">Appointment Analytics</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Outcomes</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient" className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Patient Demographics & Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Age Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Patient demographics by age group</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Main Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Main Conditions</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of primary conditions</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conditionsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {conditionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Referral Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Referral Sources</CardTitle>
                <p className="text-sm text-muted-foreground">How patients are referred to your service</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={referralData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointment">
          <div className="flex justify-center items-center h-64 border rounded-md bg-secondary/10">
            <p className="text-muted-foreground">Appointment analytics content will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="clinical">
          <div className="flex justify-center items-center h-64 border rounded-md bg-secondary/10">
            <p className="text-muted-foreground">Clinical outcomes content will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <div className="flex justify-center items-center h-64 border rounded-md bg-secondary/10">
            <p className="text-muted-foreground">Staff performance content will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="flex justify-center items-center h-64 border rounded-md bg-secondary/10">
            <p className="text-muted-foreground">Financial analytics content will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI-Driven Insights */}
      <h2 className="text-xl font-bold mb-4">AI-Driven Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Engagement */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>{patientEngagementInsight.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{patientEngagementInsight.description}</p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{patientEngagementInsight.content}</p>
            <Button variant="outline" size="sm" className="w-full">
              {patientEngagementInsight.cta} →
            </Button>
          </CardContent>
        </Card>

        {/* Risk Stratification */}
        <Card className="bg-amber-50">
          <CardHeader>
            <CardTitle>{riskStratificationInsight.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{riskStratificationInsight.description}</p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{riskStratificationInsight.content}</p>
            <Button variant="outline" size="sm" className="w-full">
              {riskStratificationInsight.cta} →
            </Button>
          </CardContent>
        </Card>

        {/* Resource Optimization */}
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle>{resourceOptimizationInsight.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{resourceOptimizationInsight.description}</p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{resourceOptimizationInsight.content}</p>
            <Button variant="outline" size="sm" className="w-full">
              {resourceOptimizationInsight.cta} →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
