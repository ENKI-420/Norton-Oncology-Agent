"use client"

import { motion } from "framer-motion"
import type { Message } from "ai"
import ReactMarkdown from "react-markdown"
import { IconUser, IconRobot } from "@tabler/icons-react"
import QuickReply from "./quick-reply"
import { useChatStore } from "@/store/chat-store"

interface MessageBubbleProps {
  message: Message
  onSuggestionClick: (suggestion: string) => void
}

export default function MessageBubble({ message, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const suggestions = useChatStore((state) => state.suggestions)

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Robot Icon (for non-user messages) */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center" aria-label="AI Bot Icon">
            <IconRobot className="h-5 w-5 text-primary" />
          </div>
        </div>
      )}

      <div className="flex flex-col max-w-[80%]">
        {/* Message Bubble */}
        <motion.div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none ml-auto"
              : "bg-card text-card-foreground rounded-tl-none border border-border"
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {isUser ? (
            <p>{message.content}</p> // User messages (Plain Text)
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown> // AI messages (Markdown Rendered)
            </div>
          )}
        </motion.div>

        {/* Quick Reply Suggestions for AI Messages */}
        {!isUser && suggestions.length > 0 && (
          <QuickReply suggestions={suggestions} onSelect={onSuggestionClick} />
        )}
      </div>

      {/* User Icon (for user messages) */}
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center" aria-label="User Icon">
            <IconUser className="h-5 w-5 text-primary" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
