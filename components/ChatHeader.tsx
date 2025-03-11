"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { IconBrain, IconDna, IconTrash, IconRefresh } from "@tabler/icons-react"
import { useChatStore } from "@/store/chat-store"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  isAiResponding: boolean
  onClearChat: () => void
  onRefresh: () => void
}

export default function ChatHeader({ isAiResponding, onClearChat, onRefresh }: ChatHeaderProps) {
  const isAnalyzing = useChatStore((state) => state.isAnalyzing)
  const aiStatus = isAiResponding ? "Processing" : isAnalyzing ? "Analyzing" : "Online"

  return (
    <motion.header
      className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20"
            animate={{
              boxShadow:
                isAiResponding || isAnalyzing
                  ? ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 10px rgba(59, 130, 246, 0)"]
                  : "0 0 0 0 rgba(59, 130, 246, 0)",
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <IconBrain className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-bold text-xl text-foreground">AGENT 2.0</h1>
            <p className="text-xs text-muted-foreground flex items-center">
              <IconDna className="h-3 w-3 mr-1" />
              Genomic Analysis & Oncology Research
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">AI Status:</span>
            <div className="flex items-center space-x-1">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  isAiResponding ? "bg-yellow-400" : isAnalyzing ? "bg-purple-400" : "bg-green-400"
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <span className="text-sm font-medium text-foreground">{aiStatus}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={onRefresh}
                title="Refresh connection"
              >
                <IconRefresh className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={onClearChat}
                title="Clear chat"
              >
                <IconTrash className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ rotate: 10, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </div>

      {(isAiResponding || isAnalyzing) && (
        <motion.div
          className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 60, ease: "linear" }}
        />
      )}
    </motion.header>
  )
}

