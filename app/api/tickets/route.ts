import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const query = searchParams.get("query") || ""

    const tickets = await serviceNowApi.getTickets({ limit, offset, query })

    return NextResponse.json({ tickets, total: tickets.length })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newTicket = await serviceNowApi.createTicket(body)

    return NextResponse.json(newTicket)
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
