import { type NextRequest, NextResponse } from "next/server"
import serviceNowApi from "@/lib/servicenow-api"
import aiService from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { ticketId, resolution, space } = await request.json()

    // Get ticket details
    const ticket = await serviceNowApi.getTicketById(ticketId)

    // Generate and create the knowledge article
    const article = await aiService.createKnowledgeArticle(ticket, resolution, space)

    // Update the ticket with the knowledge article link
    if (ticket.knowledge_links) {
      ticket.knowledge_links.push(article.id)
    } else {
      ticket.knowledge_links = [article.id]
    }

    await serviceNowApi.updateTicket(ticketId, { knowledge_links: ticket.knowledge_links })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error generating knowledge article:", error)
    return NextResponse.json({ error: "Failed to generate knowledge article" }, { status: 500 })
  }
}
