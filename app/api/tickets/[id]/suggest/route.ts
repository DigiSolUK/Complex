import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"
import aiService from "@/lib/ai-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = await serviceNowApi.getTicketById(params.id)
    const suggestion = await aiService.suggestResolution(ticket)

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error(`Error suggesting resolution for ticket ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to suggest resolution" }, { status: 500 })
  }
}
