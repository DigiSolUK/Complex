import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"
import aiService from "@/lib/ai-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = await serviceNowApi.getTicketById(params.id)
    const analysis = await aiService.analyzeTicket(ticket)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error(`Error analyzing ticket ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to analyze ticket" }, { status: 500 })
  }
}
