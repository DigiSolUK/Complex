import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"
import aiService from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    // Build query for ServiceNow
    const query = `sys_created_on>=${startDate}^sys_created_on<=${endDate}`
    const tickets = await serviceNowApi.getTickets({ query })

    // Generate the performance report
    const report = await aiService.generatePerformanceReport(tickets, startDate, endDate)

    return NextResponse.json({ report, tickets })
  } catch (error) {
    console.error("Error generating performance report:", error)
    return NextResponse.json({ error: "Failed to generate performance report" }, { status: 500 })
  }
}
