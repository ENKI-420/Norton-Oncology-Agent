import type { Message } from "ai"

// Interface to structure the response from the AI chat
export interface ChatResponse {
  message: Message
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Function to validate if a message contains sensitive health information (PHI)
export function containsSensitiveHealthInfo(message: string): boolean {
  // These patterns check for potential PHI (Sensitive health information)
  const sensitivePatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN (Social Security Number)
    /\b\d{9}\b/, // MRN (Medical Record Number)
    /\bpatient id\b/i, // Generic "patient id"
    /\bphi\b/i, // Protected Health Information (PHI)
    /\bdate of birth\b/i, // Date of birth
    /\bphone number\b/i, // Phone number
    /\bemail address\b/i, // Email
    /\baddress\b/i, // Physical address
    /\binsurance\b/i // Insurance details
  ]

  return sensitivePatterns.some((pattern) => pattern.test(message))
}

// Function to sanitize messages for HIPAA compliance
export function sanitizeForHIPAA(message: string): string {
  // Automatically redact sensitive information
  let sanitizedMessage = message

  if (containsSensitiveHealthInfo(message)) {
    sanitizedMessage = sanitizedMessage.replace(/\b\d{3}-\d{2}-\d{4}\b/, "[REDACTED SSN]")
                                        .replace(/\b\d{9}\b/, "[REDACTED MRN]")
                                        .replace(/\bphi\b/i, "[REDACTED PHI]")
                                        .replace(/\bphone number\b/i, "[REDACTED PHONE]")
                                        .replace(/\bemail address\b/i, "[REDACTED EMAIL]")
                                        .replace(/\baddress\b/i, "[REDACTED ADDRESS]")
                                        .replace(/\binsurance\b/i, "[REDACTED INSURANCE]");
    return sanitizedMessage + " [This message was redacted for HIPAA compliance.]";
  }

  return sanitizedMessage
}

// Function to format genomic data for display in a human-readable format
export function formatGenomicData(data: any): string {
  // For simplicity, we return a formatted JSON string, but complex data structures may need specific formatting
  try {
    return JSON.stringify(data, null, 2) // Pretty-print JSON data
  } catch (error) {
    console.error("Error formatting genomic data:", error)
    return "Error formatting genomic data"
  }
}

// Function to generate AI-powered quick reply suggestions based on the message content
export function generateQuickReplySuggestions(message: string): string[] {
  const content = message.toLowerCase()

  // Provide suggestions based on specific keywords or phrases
  if (content.includes("mutation")) {
    return [
      "Show more details about this mutation",
      "What are the clinical implications?",
      "Compare with normal gene sequence",
      "What genetic tests are available for this mutation?",
      "What are the common mutations associated with this condition?"
    ]
  } else if (content.includes("gene") || content.includes("expression")) {
    return [
      "Show expression levels in detail",
      "How does this affect treatment options?",
      "Are there relevant clinical trials?",
      "What gene therapies are available?",
      "What are the genetic variants linked to this condition?"
    ]
  } else if (content.includes("treatment") || content.includes("therapy")) {
    return [
      "What are the side effects?",
      "Show success rates",
      "Are there alternative treatments?",
      "What are the latest advancements in treatment?",
      "Can this treatment be personalized based on genetic data?"
    ]
  }

  return ["Can you provide more details?", "Would you like more information on this topic?"]
}

// Enhanced AI chat response for compliance and clarity
export function enhancedChatResponse(message: string): string {
  // Sanitize the message for HIPAA compliance
  const sanitizedMessage = sanitizeForHIPAA(message)

  // Format the genomic data if it includes such information
  if (message.toLowerCase().includes("genomic")) {
    return formatGenomicData(message)
  }

  // Return the sanitized message
  return sanitizedMessage
}

// Function to notify the user about sensitive health information handling
export function notifySensitiveInformationHandling(message: string): string {
  if (containsSensitiveHealthInfo(message)) {
    return `This message contains sensitive health information. Please be cautious when sharing protected health information (PHI). The message has been sanitized for HIPAA compliance.`;
  }

  return "Message is clear of any sensitive health information.";
}

// Example of an API call that includes the usage of these functions
async function processUserMessage(message: string) {
  // Get the sanitized message
  const sanitizedMessage = sanitizeForHIPAA(message)
  
  // Generate possible quick replies
  const quickReplies = generateQuickReplySuggestions(message)
  
  // Format genomic data if applicable
  const formattedGenomicData = formatGenomicData(message)

  // Return the response along with quick replies and formatted data (if applicable)
  return {
    sanitizedMessage,
    quickReplies,
    formattedGenomicData
  }
}
