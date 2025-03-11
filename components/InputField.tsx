"use client"

import type React from "react"

import { type FormEvent, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { IconSend } from "@tabler/icons-react"
import VoiceInput from "./voice-input"

interface InputFieldProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  setInput: (input: string) => void
}

export default function InputField({ input, handleInputChange, handleSubmit, isLoading, setInput }: InputFieldProps) {
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleVoiceInput = (transcript: string) => {
    setInput(input + transcript)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="relative flex items-center">
        <textarea
          ref={textareaRef}
          className="w-full bg-card/50 border border-border rounded-lg py-3 pl-4 pr-24 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[50px] max-h-[150px]"
          rows={1}
          placeholder="Ask about genomic data or oncology research..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (!isLoading && input.trim()) {
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
              }
            }
          }}
          disabled={isLoading || isListening}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <VoiceInput onTranscript={handleVoiceInput} isListening={isListening} setIsListening={setIsListening} />

          <motion.button
            type="submit"
            disabled={isLoading || !input.trim() || isListening}
            className="text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed p-2 rounded-full hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconSend className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {isListening && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm text-foreground">Listening...</p>
        </div>
      )}
    </motion.form>
  )
}

