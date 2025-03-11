"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ApiKeyContextType {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  envApiKeys: { [key: string]: string | null }
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  setApiKey: () => {},
  clearApiKey: () => {},
  envApiKeys: {},
})

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [envApiKeys, setEnvApiKeys] = useState<{ [key: string]: string | null }>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const keys = {
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || null,
      CODESRAL_API_KEY: process.env.CODESRAL_API_KEY || null,
      EPIC_FHIR_BASE_URL: process.env.EPIC_FHIR_BASE_URL || null,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || null,
      AGILE_APP_NAME: process.env.AGILE_APP_NAME || null,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || null,
      TOGETHERAI_API_KEY: process.env.TOGETHERAI_API_KEY || null,
    }
    setEnvApiKeys(keys)
    
    const localStorageApiKey = localStorage.getItem("AGENT_2_API_KEY")
    if (localStorageApiKey) {
      setApiKeyState(localStorageApiKey)
    }
    
    setLoading(false)
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem("AGENT_2_API_KEY", key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem("AGENT_2_API_KEY")
    setApiKeyState(null)
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, envApiKeys }}>
      {loading ? <div>Loading API keys...</div> : children}
    </ApiKeyContext.Provider>
  )
}

export const useApiKey = () => useContext(ApiKeyContext)

const SomeComponent = () => {
  const { apiKey, envApiKeys } = useApiKey()
  const openaiApiKey = envApiKeys.OPENAI_API_KEY
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (openaiApiKey) {
      fetchSomeData(openaiApiKey).catch((error) => {
        setError(error.message)
      })
    }
  }, [openaiApiKey])

  return (
    <div>
      {apiKey ? (
        <p>API Key Loaded: {apiKey}</p>
      ) : (
        <p>No API key found</p>
      )}
      {error && <p style={{ color: 'red' }}>{`Error: ${error}`}</p>}
    </div>
  )
}
const fetchSomeData = async (apiKey: string) => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    return await response.json()
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message) // Access the message property safely
    } else {
      throw new Error("An unknown error occurred")
    }
  }
}

