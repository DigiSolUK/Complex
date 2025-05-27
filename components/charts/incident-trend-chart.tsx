"use client"

import { useEffect, useRef } from "react"

export default function IncidentTrendChart() {
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
        { day: "Mon", critical: 3, high: 5, medium: 7, low: 4 },
        { day: "Tue", critical: 2, high: 4, medium: 6, low: 5 },
        { day: "Wed", critical: 4, high: 6, medium: 4, low: 3 },
        { day: "Thu", critical: 1, high: 3, medium: 5, low: 6 },
        { day: "Fri", critical: 3, high: 5, medium: 8, low: 4 },
        { day: "Sat", critical: 1, high: 2, medium: 3, low: 2 },
        { day: "Sun", critical: 0, high: 1, medium: 2, low: 1 },
      ]

      // Create chart elements
      const chartContent = document.createElement("div")
      chartContent.className = "flex flex-col h-full"

      // Create legend
      const legend = document.createElement("div")
      legend.className = "flex justify-end gap-4 mb-4"

      const legendItems = [
        { label: "Critical", color: "bg-[#ff9999]" },
        { label: "High", color: "bg-[#ffcc99]" },
        { label: "Medium", color: "bg-[#ffee99]" },
        { label: "Low", color: "bg-[#99ddcc]" },
      ]

      legendItems.forEach((item) => {
        const legendItem = document.createElement("div")
        legendItem.className = "flex items-center gap-1 text-sm"

        const colorIndicator = document.createElement("div")
        colorIndicator.className = `h-3 w-3 rounded-full ${item.color}`

        const label = document.createElement("span")
        label.textContent = item.label

        legendItem.appendChild(colorIndicator)
        legendItem.appendChild(label)

        legend.appendChild(legendItem)
      })

      // Create chart
      const chart = document.createElement("div")
      chart.className = "flex-1 flex items-end gap-4"

      // Find max value for scaling
      const maxValue = Math.max(...data.map((d) => d.critical + d.high + d.medium + d.low))

      // Create bars
      data.forEach((item) => {
        const barGroup = document.createElement("div")
        barGroup.className = "flex-1 flex flex-col items-center"

        const barContainer = document.createElement("div")
        barContainer.className = "w-full flex flex-col-reverse"

        // Create stacked bars
        const criticalHeight = (item.critical / maxValue) * 100
        const highHeight = (item.high / maxValue) * 100
        const mediumHeight = (item.medium / maxValue) * 100
        const lowHeight = (item.low / maxValue) * 100

        const criticalBar = document.createElement("div")
        criticalBar.className = "w-full bg-[#ff9999]"
        criticalBar.style.height = `${criticalHeight}%`

        const highBar = document.createElement("div")
        highBar.className = "w-full bg-[#ffcc99]"
        highBar.style.height = `${highHeight}%`

        const mediumBar = document.createElement("div")
        mediumBar.className = "w-full bg-[#ffee99]"
        mediumBar.style.height = `${mediumHeight}%`

        const lowBar = document.createElement("div")
        lowBar.className = "w-full bg-[#99ddcc]"
        lowBar.style.height = `${lowHeight}%`

        barContainer.appendChild(lowBar)
        barContainer.appendChild(mediumBar)
        barContainer.appendChild(highBar)
        barContainer.appendChild(criticalBar)

        const label = document.createElement("div")
        label.className = "mt-2 text-xs"
        label.textContent = item.day

        barGroup.appendChild(barContainer)
        barGroup.appendChild(label)

        chart.appendChild(barGroup)
      })

      chartContent.appendChild(legend)
      chartContent.appendChild(chart)

      chartContainer.appendChild(chartContent)
    }
  }, [])

  return (
    <div ref={chartRef} className="w-full h-full flex items-center justify-center">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  )
}
