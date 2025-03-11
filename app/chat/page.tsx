import type { Metadata } from "next"
import ChatInterface from "@/components/ChatBox"

export const metadata: Metadata = {
  title: "AGENT 2.0 | Genomic Analysis Chat",
  description: "AI-Powered Chatbot for genomic data analysis and oncology research",
}

export default function ChatPage() {
  return (
    <main className="flex flex-col h-screen">
      <ChatInterface />
    </main>
  )
}

