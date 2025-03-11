"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  isListening: boolean
  setIsListening: (isListening: boolean) => void
}

export default function VoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognitionInstance = new SpeechRecognition()
          recognitionInstance.continuous = true
          recognitionInstance.interimResults = true
          recognitionInstance.lang = "en-US"

          recognitionInstance.onresult = (event: any) => {
            const current = event.resultIndex
            const transcriptText = event.results[current][0].transcript
            setTranscript(transcriptText)
          }

          recognitionInstance.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`)
            setIsListening(false)
          }

          recognitionInstance.onend = () => {
            if (isListening) {
              try {
                recognitionInstance.start()
              } catch (e) {
                // Already started
              }
            }
          }

          setRecognition(recognitionInstance)
        } catch (e) {
          console.error("Error initializing speech recognition:", e)
          setIsSupported(false)
        }
      } else {
        setIsSupported(false)
        setError("Speech recognition not supported in this browser")
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop()
        } catch (e) {
          // Already stopped
        }
      }
    }
  }, [])

  useEffect(() => {
    if (recognition) {
      if (isListening) {
        try {
          recognition.start()
        } catch (error) {
          // Recognition might already be started
        }
      } else {
        try {
          recognition.stop()
          if (transcript) {
            onTranscript(transcript)
            setTranscript("")
          }
        } catch (error) {
          // Recognition might already be stopped
        }
      }
    }
  }, [isListening, recognition, transcript, onTranscript])

  const toggleListening = () => {
    if (!isSupported) {
      setError("Speech recognition not supported in this browser")
      return
    }
    setIsListening(!isListening)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        className={`rounded-full transition-all duration-300 ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
        onClick={toggleListening}
        title={isListening ? "Stop listening" : "Start voice input"}
        disabled={!isSupported}
      >
        {isListening ? <IconMicrophoneOff className="h-5 w-5" /> : <IconMicrophone className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="relative h-3 w-3">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </div>
              <span className="text-sm font-medium">{transcript || "Listening..."}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  )
}

