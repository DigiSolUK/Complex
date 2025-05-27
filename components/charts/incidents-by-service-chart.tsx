"use client"

import { useEffect, useRef } from "react"

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
        { service: "Database Cluster", count: 24, color: "bg-[#ff9999]" },
        { service: "API Services", count: 18, color: "bg-[#99ccff]" },
        { service: "Payment Gateway", count: 12, color: "bg-[#99ddcc]" },
        { service: "Content Delivery", count: 9, color: "bg-[#ffee99]" },
        { service: "Auth System", count: 7, color: "bg-[#cc99ff]" },
        { service: "Object Storage", count: 5, color: "bg-[#ffb3e6]" },
        { service: "Container Platform", count: 4, color: "bg-[#ffcc99]" },
      ]

      // Sort data by count (descending)
      data.sort((a, b) => b.count - a.count)

      // Calculate total for percentages
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

  return (
    <div ref={chartRef} className="w-full h-full flex items-center justify-center">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  )
}
