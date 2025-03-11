"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import InputField from "./InputField"
import FileUpload from "./FileUpload"
import Loader from "./Loader"
import { processGenomicFile } from "@/utils/fileUploadApi"
import { useChatStore } from "@/store/chat-store"
import { useToast } from "@/hooks/use-toast"
import { useApiKey } from "@/providers/api-key-provider"
import { useRouter } from "next/navigation"

export default function ChatInterface() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<File | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { apiKey } = useApiKey()
  const router = useRouter()

  // Check if API key is configured
  useEffect(() => {
    if (!apiKey && !process.env.NEXT_PUBLIC_AI_API_KEY) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key to use the chat",
        variant: "destructive",
      })
      router.push("/setup")
    }
  }, [apiKey, router, toast])

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput, reload, stop, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        apiKey: apiKey,
      },
      onFinish: () => {
        scrollToBottom()
        // Generate suggestions based on the AI's response
        useChatStore.getState().generateSuggestions(messages)
      },
      onError: (error) => {
        console.error("Chat error:", error)
        toast({
          title: "Error",
          description: "Failed to get a response. Please check your API key or try again later.",
          variant: "destructive",
        })
      },
    })

  const setIsAnalyzing = useChatStore((state) => state.setIsAnalyzing)
  const clearSuggestions = useChatStore((state) => state.clearSuggestions)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Clear suggestions when user starts typing
    if (input.trim().length > 0) {
      clearSuggestions()
    }
  }, [input, clearSuggestions])

  const handleClearChat = () => {
    setMessages([])
    clearSuggestions()
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    })
  }

  const handleRefreshConnection = () => {
    if (isLoading) {
      stop()
      toast({
        title: "Request stopped",
        description: "The current AI response has been stopped.",
      })
    } else {
      reload()
      toast({
        title: "Connection refreshed",
        description: "The AI connection has been refreshed.",
      })
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setFilePreview(file)
    setIsAnalyzing(true)

    try {
      // Simulate upload progress
      simulateUploadProgress()

      // Process the genomic file
      const analysisResult = await processGenomicFile(file)

      completeFileUpload()

      // Add file upload message from user
      appendMessage(`Uploaded file: ${file.name} for analysis`)

      // Add AI response with analysis
      appendMessage(analysisResult, "assistant")

      // Generate suggestions based on the analysis
      setTimeout(() => {
        useChatStore.getState().generateSuggestions(messages)
      }, 500)

      toast({
        title: "File analyzed",
        description: `Successfully analyzed ${file.name}`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      handleFileUploadError(file.name)
    }
  }

  const simulateUploadProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)
  }

  const completeFileUpload = () => {
    setUploadProgress(100)
    setFilePreview(null)
    setIsUploading(false)
    setIsAnalyzing(false)
  }

  const appendMessage = (content: string, role: "data" | "system" | "user" | "assistant" = "user") => {
    append({
      id: Date.now().toString(),
      content,
      role,
    })
  }

  const handleFileUploadError = (fileName: string) => {
    setIsUploading(false)
    setUploadProgress(0)
    setIsAnalyzing(false)

    // Add error message
    appendMessage(`Error analyzing file: ${fileName}. Please try again.`, "assistant")

    toast({
      title: "Error",
      description: `Failed to analyze ${fileName}. Please try again.`,
      variant: "destructive",
    })
  }

  const cancelFileUpload = () => {
    setFilePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    toast({
      title: "Upload cancelled",
      description: "File upload has been cancelled.",
    })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    clearSuggestions()

    // Focus on the input field
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.focus()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl w-full mx-auto">
      <ChatHeader isAiResponding={isLoading} onClearChat={handleClearChat} onRefresh={handleRefreshConnection} />

      {/* Chat Messages Area */}
      <motion.div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                </div>
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                      "0 0 0 20px rgba(59, 130, 246, 0.1)",
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </motion.div>

              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to AGENT 2.0</h2>
              <p className="text-muted-foreground mb-6">AI-powered genomic analysis assistant for oncology research</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <motion.div
                  className="bg-card/50 p-4 rounded-lg border border-border"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-medium text-foreground mb-2">Ask Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Inquire about genomic markers, cancer research, or treatment options
                  </p>
                </motion.div>
                <motion.div
                  className="bg-card/50 p-4 rounded-lg border border-border"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-medium text-foreground mb-2">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">Analyze genomic data files (CSV, FASTA, TXT, PDF)</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onSuggestionClick={handleSuggestionClick} />
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File Preview Area */}
      {filePreview && (
        <motion.div
          className="px-4 py-2 bg-card/50 border-t border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{filePreview.name}</p>
                <p className="text-xs text-muted-foreground">{(filePreview.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={cancelFileUpload} className="text-muted-foreground hover:text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Analyzing genomic data...</p>
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-background/50 p-4">
        <FileUpload onFileSelect={handleFileUpload} isUploading={isUploading} />
        <InputField
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading || isUploading}
          setInput={setInput}
        />
      </div>
    </div>
  )
}
