'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface QuickReplyProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  onSend: (query: string) => void // Added onSend prop to trigger send action directly
}

export default function QuickReply({ suggestions, onSelect, onSend }: QuickReplyProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Handle keyboard navigation and selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && focusedIndex !== null && focusedIndex < suggestions.length - 1) {
      setFocusedIndex(focusedIndex + 1)
    } else if (e.key === "ArrowUp" && focusedIndex !== null && focusedIndex > 0) {
      setFocusedIndex(focusedIndex - 1)
    } else if (e.key === "Enter" && focusedIndex !== null) {
      handleSelection(suggestions[focusedIndex]) // Auto-send on Enter
    }
  }

  // Focus on the selected suggestion when focusedIndex changes
  useEffect(() => {
    if (focusedIndex !== null) {
      document.getElementById(`suggestion-${focusedIndex}`)?.focus()
    }
  }, [focusedIndex])

  // Handle the selection of a suggestion and auto-send
  const handleSelection = (suggestion: string) => {
    setSelectedIndex(focusedIndex)
    onSelect(suggestion) // Optional, you can keep this if needed
    onSend(suggestion)  // Automatically send the selected suggestion
    setFocusedIndex(null) // Reset focused index after selection
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 mt-2"
      onKeyDown={handleKeyDown}
      tabIndex={0} // Allow keyboard interaction
      role="listbox" // ARIA role for the container
    >
      {suggestions.map((suggestion, index) => {
        const isSelected = selectedIndex === index
        const isFocused = focusedIndex === index

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
            role="option" // ARIA role for individual suggestions
            aria-selected={isSelected}
          >
            <Button
              id={`suggestion-${index}`}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-300 ${
                isFocused ? "border-accent text-accent" : "border-primary/20 text-primary"
              } ${isSelected ? "bg-accent text-foreground" : "hover:bg-primary/10"}`}
              onClick={() => handleSelection(suggestion)} // Auto-send on click
              onFocus={() => setFocusedIndex(index)} // Highlight the suggestion on focus
              aria-label={`Select ${suggestion}`}
            >
              {suggestion}
            </Button>

            {/* Add visual feedback for selected item */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="absolute top-0 left-0 right-0 bottom-0 rounded-lg border-4 border-accent/40"
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
