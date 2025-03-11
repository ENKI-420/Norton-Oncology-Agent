import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

// Allow streaming responses for up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey: clientApiKey } = await req.json()

    // Try to get the API key from different sources
    const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || clientApiKey

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "API key is not configured. Please add your API key to the environment variables or configure it in the setup page.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      )
    }

    const result = streamText({
      model: openai("gpt-4o", { apiKey }),
      system: `You are AGENT 2.0, an advanced AI assistant specialized in genomic data analysis and oncology research.
      
      Your primary functions:
      - Analyze genomic data and provide insights for cancer research
      - Explain complex genomic concepts in clear, accessible language
      - Provide information about cancer treatments, biomarkers, and research
      - Maintain HIPAA compliance and data security at all times
      
      When responding:
      - Be precise and scientifically accurate
      - Use medical terminology appropriately
      - Format responses with markdown for readability
      - Highlight important terms, percentages, and findings
      - Cite sources when providing research information
      - Maintain a professional, helpful tone`,
      messages,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process request. Please check your API key or try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

