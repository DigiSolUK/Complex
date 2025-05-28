/**
 * ServiceNow API Integration Service
 */

export interface ServiceNowTicket {
  id: string
  number: string
  short_description: string
  description: string
  priority: number
  state: number
  category: string
  assigned_to: string
  created_on: string
  updated_on: string
  resolved_on?: string
  resolution_notes?: string
  knowledge_links?: string[]
}

export interface ServiceNowUser {
  id: string
  name: string
  email: string
}

class ServiceNowAPI {
  private baseUrl: string
  private apiKey: string
  private username: string
  private password: string

  constructor() {
    this.baseUrl = process.env.SERVICENOW_API_URL || ""
    this.apiKey = process.env.SERVICENOW_API_KEY || ""
    this.username = process.env.SERVICENOW_USERNAME || ""
    this.password = process.env.SERVICENOW_PASSWORD || ""
  }

  private async getAuthHeader() {
    const authString = Buffer.from(`${this.username}:${this.password}`).toString("base64")
    return {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": this.apiKey,
    }
  }

  async getTickets(params: { limit?: number; offset?: number; query?: string } = {}): Promise<ServiceNowTicket[]> {
    const { limit = 50, offset = 0, query = "" } = params

    try {
      const headers = await this.getAuthHeader()
      const queryString = new URLSearchParams({
        sysparm_limit: limit.toString(),
        sysparm_offset: offset.toString(),
        sysparm_query: query,
      }).toString()

      const response = await fetch(`${this.baseUrl}/api/now/table/incident?${queryString}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`)
      }

      const data = await response.json()
      return data.result.map((ticket: any) => ({
        id: ticket.sys_id,
        number: ticket.number,
        short_description: ticket.short_description,
        description: ticket.description,
        priority: ticket.priority,
        state: ticket.state,
        category: ticket.category,
        assigned_to: ticket.assigned_to?.value || "",
        created_on: ticket.sys_created_on,
        updated_on: ticket.sys_updated_on,
        resolved_on: ticket.resolved_at,
        resolution_notes: ticket.close_notes,
        knowledge_links: ticket.knowledge_links?.split(",") || [],
      }))
    } catch (error) {
      console.error("Error fetching tickets from ServiceNow:", error)
      throw error
    }
  }

  async getTicketById(ticketId: string): Promise<ServiceNowTicket> {
    try {
      const headers = await this.getAuthHeader()
      const response = await fetch(`${this.baseUrl}/api/now/table/incident/${ticketId}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`)
      }

      const data = await response.json()
      const ticket = data.result

      return {
        id: ticket.sys_id,
        number: ticket.number,
        short_description: ticket.short_description,
        description: ticket.description,
        priority: ticket.priority,
        state: ticket.state,
        category: ticket.category,
        assigned_to: ticket.assigned_to?.value || "",
        created_on: ticket.sys_created_on,
        updated_on: ticket.sys_updated_on,
        resolved_on: ticket.resolved_at,
        resolution_notes: ticket.close_notes,
        knowledge_links: ticket.knowledge_links?.split(",") || [],
      }
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId} from ServiceNow:`, error)
      throw error
    }
  }

  async updateTicket(ticketId: string, updates: Partial<ServiceNowTicket>): Promise<ServiceNowTicket> {
    try {
      const headers = await this.getAuthHeader()

      // Transform our model to ServiceNow expected format
      const payload: any = {}
      if (updates.short_description) payload.short_description = updates.short_description
      if (updates.description) payload.description = updates.description
      if (updates.priority) payload.priority = updates.priority
      if (updates.state) payload.state = updates.state
      if (updates.resolution_notes) payload.close_notes = updates.resolution_notes
      if (updates.knowledge_links) payload.knowledge_links = updates.knowledge_links.join(",")

      const response = await fetch(`${this.baseUrl}/api/now/table/incident/${ticketId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`)
      }

      return this.getTicketById(ticketId)
    } catch (error) {
      console.error(`Error updating ticket ${ticketId} in ServiceNow:`, error)
      throw error
    }
  }

  async createTicket(ticketData: Partial<ServiceNowTicket>): Promise<ServiceNowTicket> {
    try {
      const headers = await this.getAuthHeader()

      // Transform our model to ServiceNow expected format
      const payload: any = {
        short_description: ticketData.short_description || "New Ticket",
        description: ticketData.description || "",
        priority: ticketData.priority || 3,
        category: ticketData.category || "inquiry",
      }

      const response = await fetch(`${this.baseUrl}/api/now/table/incident`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`)
      }

      const data = await response.json()
      return this.getTicketById(data.result.sys_id)
    } catch (error) {
      console.error("Error creating ticket in ServiceNow:", error)
      throw error
    }
  }

  async getTicketMetrics(ticketId: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader()
      const response = await fetch(`${this.baseUrl}/api/now/table/task_sla?sysparm_query=task=${ticketId}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`)
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error(`Error fetching metrics for ticket ${ticketId}:`, error)
      throw error
    }
  }
}

// Create a singleton instance
const serviceNowApi = new ServiceNowAPI()
export default serviceNowApi
