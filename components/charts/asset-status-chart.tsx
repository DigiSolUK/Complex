"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for asset status
const data = [
  { name: "Online", value: 432, color: "#00A859" },
  { name: "Warning", value: 32, color: "#FF6900" },
  { name: "Offline", value: 23, color: "#D5001F" },
]

export function AssetStatusChart() {
  return (
    <ChartContainer
      config={{
        Online: {
          label: "Online",
          color: "#00A859",
        },
        Warning: {
          label: "Warning",
          color: "#FF6900",
        },
        Offline: {
          label: "Offline",
          color: "#D5001F",
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
