/**
 * AI Service for Ticket Analysis and Resolution Suggestions
 */

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import type { ServiceNowTicket } from "./servicenow-api"
import type { ConfluenceArticle } from "./confluence-api"
import confluenceApi from "./confluence-api"

export interface ResolutionSuggestion {
  suggestion: string
  confidence: number
  reasoning: string
  knowledgeArticles: ConfluenceArticle[]
  automationPossible: boolean
  automationSteps?: string[]
}

export interface TicketAnalysis {
  category: string
  priority: number
  complexity: "low" | "medium" | "high"
  estimatedResolutionTime: number // in minutes
  keyInsights: string[]
  suggestedTags: string[]
  similarTickets?: string[]
}

class AIService {
  private knowledgeCache: Map<string, ConfluenceArticle[]> = new Map()

  /**
   * Analyzes a ServiceNow ticket and provides detailed insights
   */
  async analyzeTicket(ticket: ServiceNowTicket): Promise<TicketAnalysis> {
    try {
      const prompt = `
        You are an AI assistant specialized in IT service management. Analyze the following ticket details:
        
        Ticket Number: ${ticket.number}
        Title: ${ticket.short_description}
        Description: ${ticket.description}
        Current Priority: ${ticket.priority}
        Current State: ${ticket.state}
        Category: ${ticket.category}
        
        Please provide a structured analysis with the following:
        1. Suggested category (if the current one seems incorrect)
        2. Suggested priority level (1-5, where 1 is highest)
        3. Complexity assessment (low, medium, high)
        4. Estimated resolution time in minutes
        5. Key insights from the ticket description (list 3-5 points)
        6. Suggested tags for this ticket (list 3-5 tags)
        
        Format your response as a JSON object with the following structure:
        {
          "category": "string",
          "priority": number,
          "complexity": "low|medium|high",
          "estimatedResolutionTime": number,
          "keyInsights": ["string"],
          "suggestedTags": ["string"]
        }
        
        Only return the JSON object, no additional text.
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.2,
        maxTokens: 1000,
      })

      const analysis = JSON.parse(text)
      return analysis as TicketAnalysis
    } catch (error) {
      console.error("Error analyzing ticket:", error)
      throw error
    }
  }

  /**
   * Searches knowledge base and suggests resolution based on ticket content
   */
  async suggestResolution(ticket: ServiceNowTicket): Promise<ResolutionSuggestion> {
    try {
      // First search for relevant knowledge articles
      const searchQuery = `${ticket.short_description} ${ticket.category}`
      const relevantArticles = await this.searchKnowledgeBase(searchQuery)

      // Extract content from articles to include in prompt
      const articleContentForPrompt = relevantArticles
        .slice(0, 3)
        .map((article, index) => {
          return `Article ${index + 1}: ${article.title}\n${this.stripHtmlTags(article.content).substring(0, 500)}...\n`
        })
        .join("\n")

      const prompt = `
        You are an AI assistant specialized in IT service management. Suggest a resolution for the following ticket based on the provided knowledge base articles:
        
        Ticket Number: ${ticket.number}
        Title: ${ticket.short_description}
        Description: ${ticket.description}
        Priority: ${ticket.priority}
        Category: ${ticket.category}
        
        Relevant knowledge base articles:
        ${articleContentForPrompt}
        
        Please provide:
        1. A suggested resolution for this ticket
        2. Your confidence level in this resolution (0-100%)
        3. Reasoning behind your suggestion
        4. Whether this ticket could be automatically resolved (true/false)
        5. If automation is possible, list the steps for automation
        
        Format your response as a JSON object with the following structure:
        {
          "suggestion": "string",
          "confidence": number,
          "reasoning": "string",
          "automationPossible": boolean,
          "automationSteps": ["string"]
        }
        
        Only return the JSON object, no additional text.
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.3,
        maxTokens: 1500,
      })

      const suggestion = JSON.parse(text)
      return {
        ...suggestion,
        knowledgeArticles: relevantArticles,
      }
    } catch (error) {
      console.error("Error suggesting resolution:", error)
      throw error
    }
  }

  /**
   * Searches the knowledge base for articles relevant to a query
   */
  async searchKnowledgeBase(query: string): Promise<ConfluenceArticle[]> {
    // Check cache first
    if (this.knowledgeCache.has(query)) {
      return this.knowledgeCache.get(query) || []
    }

    try {
      const articles = await confluenceApi.searchArticles(query)

      // Cache the results
      this.knowledgeCache.set(query, articles)

      return articles
    } catch (error) {
      console.error("Error searching knowledge base:", error)
      throw error
    }
  }

  /**
   * Creates a new knowledge article based on a resolved ticket
   */
  async createKnowledgeArticle(
    ticket: ServiceNowTicket,
    resolution: string,
    space: string,
  ): Promise<ConfluenceArticle> {
    try {
      const prompt = `
        You are an AI assistant specialized in knowledge management. Create a knowledge base article based on this resolved ticket:
        
        Ticket Title: ${ticket.short_description}
        Ticket Description: ${ticket.description}
        Resolution: ${resolution}
        
        Create a structured knowledge article with the following sections:
        1. Problem Description
        2. Symptoms
        3. Cause
        4. Resolution Steps
        5. Prevention Tips
        
        Format your response in HTML suitable for a Confluence page. Make it professional and well-structured.
        Use appropriate headings (<h1>, <h2>, etc.), paragraphs, and lists.
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.2,
        maxTokens: 2000,
      })

      // Generate appropriate tags
      const tagsPrompt = `
        Based on this IT service ticket, suggest 5-8 relevant tags for categorizing it in a knowledge base:
        
        Ticket Title: ${ticket.short_description}
        Ticket Description: ${ticket.description}
        Resolution: ${resolution}
        
        Format your response as a JSON array of strings. Only return the JSON array, no additional text.
      `

      const { text: tagsText } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt: tagsPrompt,
        temperature: 0.2,
        maxTokens: 200,
      })

      const tags = JSON.parse(tagsText)

      // Create the article in Confluence
      return confluenceApi.createArticle(space, `KB: ${ticket.short_description}`, text, tags)
    } catch (error) {
      console.error("Error creating knowledge article:", error)
      throw error
    }
  }

  /**
   * Generates a performance report based on ticket data
   */
  async generatePerformanceReport(tickets: ServiceNowTicket[], startDate: string, endDate: string): Promise<string> {
    try {
      // Calculate key metrics
      const totalTickets = tickets.length
      const resolvedTickets = tickets.filter((t) => t.resolved_on).length
      const resolvedWithKBTickets = tickets.filter(
        (t) => t.resolved_on && t.knowledge_links && t.knowledge_links.length > 0,
      ).length

      // Calculate average resolution time
      const resolutionTimes = tickets
        .filter((t) => t.resolved_on)
        .map((t) => {
          const created = new Date(t.created_on).getTime()
          const resolved = new Date(t.resolved_on!).getTime()
          return (resolved - created) / (1000 * 60) // minutes
        })

      const avgResolutionTime =
        resolutionTimes.length > 0 ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length : 0

      const prompt = `
        You are an AI assistant specialized in IT service management analytics. Generate an insightful performance report based on these metrics:
        
        Period: ${startDate} to ${endDate}
        Total Tickets: ${totalTickets}
        Resolved Tickets: ${resolvedTickets}
        Tickets Resolved with Knowledge Base: ${resolvedWithKBTickets}
        Average Resolution Time: ${avgResolutionTime.toFixed(2)} minutes
        
        Provide analysis of these numbers, trends, areas for improvement, and recommendations.
        Format your response in HTML suitable for a report page with appropriate headings, paragraphs, and sections.
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.2,
        maxTokens: 2000,
      })

      return text
    } catch (error) {
      console.error("Error generating performance report:", error)
      throw error
    }
  }

  /**
   * Helper function to strip HTML tags from content
   */
  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>?/gm, "")
  }
}

// Create a singleton instance
const aiService = new AIService()
export default aiService
