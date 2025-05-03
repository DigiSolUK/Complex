import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { BarChart2, FileDown, RefreshCw } from "lucide-react";

export default function Reports() {
  const { isDemoMode } = useAuth();
  const [reportType, setReportType] = useState("patient-summary");
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
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Report Type
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient-summary">Patient Summary</SelectItem>
                    <SelectItem value="appointment-analysis">Appointment Analysis</SelectItem>
                    <SelectItem value="care-plan-metrics">Care Plan Metrics</SelectItem>
                    <SelectItem value="staff-activity">Staff Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleGenerateReport} className="flex-1">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                {displayReportData && (
                  <Button variant="outline" onClick={handleExportReport}>
                    <FileDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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
