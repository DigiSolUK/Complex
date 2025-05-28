/**
 * Confluence API Integration Service
 */

export interface ConfluenceArticle {
  id: string
  title: string
  content: string
  lastUpdated: string
  author: string
  space: string
  labels: string[]
  url: string
}

class ConfluenceAPI {
  private baseUrl: string
  private apiToken: string
  private username: string

  constructor() {
    this.baseUrl = process.env.CONFLUENCE_API_URL || ""
    this.apiToken = process.env.CONFLUENCE_API_TOKEN || ""
    this.username = process.env.CONFLUENCE_USERNAME || ""
  }

  private async getAuthHeader() {
    const authString = Buffer.from(`${this.username}:${this.apiToken}`).toString("base64")
    return {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  async searchArticles(query: string, space?: string, limit = 10): Promise<ConfluenceArticle[]> {
    try {
      const headers = await this.getAuthHeader()
      let cqlQuery = `text ~ "${query}"`

      if (space) {
        cqlQuery += ` AND space = "${space}"`
      }

      const response = await fetch(
        `${this.baseUrl}/rest/api/content/search?cql=${encodeURIComponent(cqlQuery)}&limit=${limit}&expand=body.storage,space,metadata.labels`,
        {
          method: "GET",
          headers,
        },
      )

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status}`)
      }

      const data = await response.json()
      return data.results.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.body.storage.value,
        lastUpdated: article.history.lastUpdated.when,
        author: article.history.lastUpdated.by.displayName,
        space: article.space.name,
        labels: article.metadata.labels.results.map((label: any) => label.name),
        url: `${this.baseUrl}${article._links.webui}`,
      }))
    } catch (error) {
      console.error("Error searching Confluence articles:", error)
      throw error
    }
  }

  async getArticleById(articleId: string): Promise<ConfluenceArticle> {
    try {
      const headers = await this.getAuthHeader()
      const response = await fetch(
        `${this.baseUrl}/rest/api/content/${articleId}?expand=body.storage,space,metadata.labels,history.lastUpdated`,
        {
          method: "GET",
          headers,
        },
      )

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status}`)
      }

      const article = await response.json()
      return {
        id: article.id,
        title: article.title,
        content: article.body.storage.value,
        lastUpdated: article.history.lastUpdated.when,
        author: article.history.lastUpdated.by.displayName,
        space: article.space.name,
        labels: article.metadata.labels.results.map((label: any) => label.name),
        url: `${this.baseUrl}${article._links.webui}`,
      }
    } catch (error) {
      console.error(`Error fetching Confluence article ${articleId}:`, error)
      throw error
    }
  }

  async createArticle(
    spaceKey: string,
    title: string,
    content: string,
    labels: string[] = [],
  ): Promise<ConfluenceArticle> {
    try {
      const headers = await this.getAuthHeader()
      const payload = {
        type: "page",
        title: title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: content,
            representation: "storage",
          },
        },
        metadata: {
          labels: labels.map((label) => ({ name: label })),
        },
      }

      const response = await fetch(`${this.baseUrl}/rest/api/content`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status}`)
      }

      const result = await response.json()
      return this.getArticleById(result.id)
    } catch (error) {
      console.error("Error creating Confluence article:", error)
      throw error
    }
  }

  async updateArticle(
    articleId: string,
    title: string,
    content: string,
    labels: string[] = [],
  ): Promise<ConfluenceArticle> {
    try {
      // First get the current version of the article
      const currentArticle = await this.getArticleById(articleId)
      const headers = await this.getAuthHeader()

      const payload = {
        type: "page",
        title: title,
        version: { number: Number.parseInt(currentArticle.id, 10) + 1 },
        body: {
          storage: {
            value: content,
            representation: "storage",
          },
        },
        metadata: {
          labels: labels.map((label) => ({ name: label })),
        },
      }

      const response = await fetch(`${this.baseUrl}/rest/api/content/${articleId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status}`)
      }

      return this.getArticleById(articleId)
    } catch (error) {
      console.error(`Error updating Confluence article ${articleId}:`, error)
      throw error
    }
  }

  async getRecentlyUpdatedArticles(spaceKey?: string, limit = 10): Promise<ConfluenceArticle[]> {
    try {
      const headers = await this.getAuthHeader()
      let url = `${this.baseUrl}/rest/api/content/search?cql=type=page ORDER BY lastmodified DESC&limit=${limit}&expand=body.storage,space,metadata.labels`

      if (spaceKey) {
        url += `&space=${spaceKey}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status}`)
      }

      const data = await response.json()
      return data.results.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.body.storage.value,
        lastUpdated: article.history.lastUpdated.when,
        author: article.history.lastUpdated.by.displayName,
        space: article.space.name,
        labels: article.metadata.labels.results.map((label: any) => label.name),
        url: `${this.baseUrl}${article._links.webui}`,
      }))
    } catch (error) {
      console.error("Error fetching recently updated Confluence articles:", error)
      throw error
    }
  }
}

// Create a singleton instance
const confluenceApi = new ConfluenceAPI()
export default confluenceApi
