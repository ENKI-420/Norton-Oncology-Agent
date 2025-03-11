import { create } from "zustand"
import type { Message } from "ai"

interface ChatState {
  suggestions: string[]
  setSuggestions: (suggestions: string[]) => void
  clearSuggestions: () => void
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  isAnalyzing: boolean
  setIsAnalyzing: (isAnalyzing: boolean) => void
  generateSuggestions: (messages: Message[]) => void
}

export const useChatStore = create<ChatState>((set) => ({
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  clearSuggestions: () => set({ suggestions: [] }),
  theme: "dark",
  setTheme: (theme) => set({ theme }),
  isAnalyzing: false,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  generateSuggestions: (messages) => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return

    // Generate suggestions based on the last AI message
    const content = lastMessage.content.toLowerCase()

    if (content.includes("mutation")) {
      set({
        suggestions: ["Show more details", "Check related mutations", "Compare with normal data"],
      })
    } else if (content.includes("gene") || content.includes("expression")) {
      set({
        suggestions: ["Show expression levels", "Compare with reference genome", "Check pathway involvement"],
      })
    } else if (content.includes("treatment") || content.includes("therapy")) {
      set({
        suggestions: ["Show clinical trials", "Check side effects", "Compare treatment options"],
      })
    } else if (content.includes("cancer") || content.includes("tumor")) {
      set({
        suggestions: ["Show survival rates", "Check biomarkers", "View molecular subtypes"],
      })
    } else if (content.includes("analysis") || content.includes("result")) {
      set({
        suggestions: ["Explain in simpler terms", "Show detailed breakdown", "Compare with previous results"],
      })
    } else {
      set({ suggestions: [] })
    }
  },
}))

