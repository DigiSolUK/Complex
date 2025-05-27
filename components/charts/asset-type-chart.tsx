"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for asset types
const data = [
  { name: "Servers", value: 78, color: "#006FCF" },
  { name: "Workstations", value: 215, color: "#00A859" },
  { name: "Network", value: 94, color: "#FF6900" },
  { name: "Mobile", value: 62, color: "#D5001F" },
  { name: "Other", value: 38, color: "#53565A" },
]

export function AssetTypeChart() {
  return (
    <ChartContainer
      config={{
        Servers: {
          label: "Servers",
          color: "#006FCF",
        },
        Workstations: {
          label: "Workstations",
          color: "#00A859",
        },
        Network: {
          label: "Network",
          color: "#FF6900",
        },
        Mobile: {
          label: "Mobile",
          color: "#D5001F",
        },
        Other: {
          label: "Other",
          color: "#53565A",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
