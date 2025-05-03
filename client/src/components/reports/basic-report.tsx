import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

// Type definitions for report data
interface ReportSummary {
  [key: string]: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ReportData {
  title: string;
  period: string;
  summary: ReportSummary;
  [key: string]: ReportSummary | ChartData[] | string;
}

const COLORS = ["#0ea5e9", "#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#ec4899"];

export function BasicReport({ data }: { data: ReportData }) {
  // Extract chart data
  const chartKeys = Object.keys(data).filter(
    (key) => Array.isArray(data[key]) && key !== "summary" && key !== "title" && key !== "period"
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>Period: {data.period}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.summary).map(([key, value]) => (
              <div key={key} className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {chartKeys.map((chartKey, index) => {
        const chartData = data[chartKey] as ChartData[];
        const isFirstChart = index === 0;

        // Choose between bar chart and pie chart based on the data structure
        const shouldUsePieChart = chartData.length <= 5;

        return (
          <Card key={chartKey}>
            <CardHeader>
              <CardTitle className="capitalize">
                {chartKey.replace(/([A-Z])/g, ' $1').replace(/^by/, 'By ').trim()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {shouldUsePieChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}`, '']} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={isFirstChart ? "#0ea5e9" : "#14b8a6"}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
