import { type NextRequest, NextResponse } from "next/server"
import confluenceApi from "@/lib/confluence-api"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const space = searchParams.get("space") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const articles = await confluenceApi.searchArticles(query, space, limit)

    return NextResponse.json({ articles, total: articles.length })
  } catch (error) {
    console.error("Error searching knowledge base:", error)
    return NextResponse.json({ error: "Failed to search knowledge base" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { space, title, content, labels } = await request.json()
    const article = await confluenceApi.createArticle(space, title, content, labels)

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error creating knowledge article:", error)
    return NextResponse.json({ error: "Failed to create knowledge article" }, { status: 500 })
  }
}
