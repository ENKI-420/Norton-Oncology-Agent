import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ApiKeyProvider } from "@/providers/api-key-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "AGENT 2.0 | Genomic Analysis Platform",
  description: "AI-Powered Chatbot for genomic data analysis and oncology research",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ApiKeyProvider>
            {children}
            <Toaster />
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'