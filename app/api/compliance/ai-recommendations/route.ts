import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { currentThresholds, serviceData } = await req.json()

    // Prepare the prompt with the current thresholds and service data
    const prompt = `
      As a financial compliance AI assistant, analyze the following data and provide recommendations for FCA compliance thresholds:

      Current Thresholds:
      - Critical Services: ${currentThresholds.criticalServices.uptime}% uptime, ${currentThresholds.criticalServices.responseTime} min response time
      - Important Services: ${currentThresholds.importantServices.uptime}% uptime, ${currentThresholds.importantServices.responseTime} min response time
      
      Service Performance Data:
      - Critical Services: ${serviceData.criticalIncidents} incidents, ${serviceData.averageResponseTimes.critical} min avg response time
      - Important Services: ${serviceData.importantIncidents} incidents, ${serviceData.averageResponseTimes.important} min avg response time
      
      Based on this data, recommend optimized thresholds for uptime and response time that balance regulatory compliance with operational reality. 
      
      Format your response as a JSON object with the following structure:
      {
        "criticalServices": {
          "uptime": number,
          "responseTime": number
        },
        "importantServices": {
          "uptime": number,
          "responseTime": number
        },
        "explanation": "string explaining the rationale for these recommendations"
      }
      
      Only return the JSON object, nothing else.
    `

    // Generate recommendations using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.2,
      maxTokens: 1000,
    })

    // Parse the response as JSON
    const recommendations = JSON.parse(text)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
