"use client"

import { useEffect, useRef } from "react"
// Add proper chart implementation using Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function IncidentsByServiceChart() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for chart rendering
    // In a real app, you would use a charting library like Chart.js, Recharts, or D3
    if (chartRef.current) {
      const chartContainer = chartRef.current

      // Clear previous content
      chartContainer.innerHTML = ""

      // Sample data
      const data = [
        { service: "Database Cluster", count: 24, color: "#ff9999" },
        { service: "API Services", count: 18, color: "#99ccff" },
        { service: "Payment Gateway", count: 12, color: "#99ddcc" },
        { service: "Content Delivery", count: 9, color: "#ffee99" },
        { service: "Auth System", count: 7, color: "#cc99ff" },
        { service: "Object Storage", count: 5, color: "#ffb3e6" },
        { service: "Container Platform", count: 4, color: "#ffcc99" },
      ]

      // Sort data by count (descending)
      data.sort((a, b) => b.count - a.count)

      // Calculate total incidents
      const total = data.reduce((sum, item) => sum + item.count, 0)

      // Create chart elements
      const chartContent = document.createElement("div")
      chartContent.className = "space-y-4"

      data.forEach((item) => {
        const percentage = Math.round((item.count / total) * 100)

        const row = document.createElement("div")
        row.className = "space-y-1"

        const labelRow = document.createElement("div")
        labelRow.className = "flex justify-between text-sm"

        const label = document.createElement("div")
        label.textContent = item.service

        const value = document.createElement("div")
        value.className = "font-medium"
        value.textContent = `${item.count} (${percentage}%)`

        labelRow.appendChild(label)
        labelRow.appendChild(value)

        const barContainer = document.createElement("div")
        barContainer.className = "h-2 w-full bg-muted rounded-full overflow-hidden"

        const bar = document.createElement("div")
        bar.className = `h-full ${item.color} rounded-full`
        bar.style.width = `${percentage}%`

        barContainer.appendChild(bar)

        row.appendChild(labelRow)
        row.appendChild(barContainer)

        chartContent.appendChild(row)
      })

      chartContainer.appendChild(chartContent)
    }
  }, [])

  const data = [
    { service: "Database Cluster", count: 24, color: "#ff9999" },
    { service: "API Services", count: 18, color: "#99ccff" },
    { service: "Payment Gateway", count: 12, color: "#99ddcc" },
    { service: "Content Delivery", count: 9, color: "#ffee99" },
    { service: "Auth System", count: 7, color: "#cc99ff" },
    { service: "Object Storage", count: 5, color: "#ffb3e6" },
    { service: "Container Platform", count: 4, color: "#ffcc99" },
  ]

  // Sort data by count (descending)
  data.sort((a, b) => b.count - a.count)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="service" width={100} />
        <Tooltip formatter={(value) => [`${value} incidents`, "Count"]} labelFormatter={() => ""} />
        <Bar dataKey="count" fill="#99ccff" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
