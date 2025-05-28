import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = await serviceNowApi.getTicketById(params.id)

    return NextResponse.json(ticket)
  } catch (error) {
    console.error(`Error fetching ticket ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedTicket = await serviceNowApi.updateTicket(params.id, body)

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error(`Error updating ticket ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
