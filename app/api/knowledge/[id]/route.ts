import { type NextRequest, NextResponse } from "next/server"
import confluenceApi from "@/lib/confluence-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await confluenceApi.getArticleById(params.id)

    return NextResponse.json(article)
  } catch (error) {
    console.error(`Error fetching knowledge article ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch knowledge article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, content, labels } = await request.json()
    const article = await confluenceApi.updateArticle(params.id, title, content, labels)

    return NextResponse.json(article)
  } catch (error) {
    console.error(`Error updating knowledge article ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update knowledge article" }, { status: 500 })
  }
}
