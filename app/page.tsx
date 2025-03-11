"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EpicLoginAndReport from '@/components/beakerReportFetcher';  // Verify path

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyExists, setApiKeyExists] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check API Key logic with recursion
    const apiKeySources = ["env", "localStorage", "sessionStorage"];
    const checkApiKey = (sources: string[], retryCount: number = 0) => {
      const apiKey = sources.find(source => {
        if (source === "env") {
          return process.env.NEXT_PUBLIC_AI_API_KEY;
        }
        if (source === "localStorage") {
          return localStorage.getItem("AGENT_2_API_KEY");
        }
        if (source === "sessionStorage") {
          return sessionStorage.getItem("AGENT_2_API_KEY");
        }
        return null;
      });

      if (apiKey) {
        setApiKeyExists(true);
        router.push("/chat");
        return;
      }

      // Retry or fallback to setup page
      if (retryCount < sources.length) {
        checkApiKey([sources[retryCount]], retryCount + 1);
      } else {
        setApiKeyExists(false);
        router.push("/setup");
      }
    };

    checkApiKey(apiKeySources);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!apiKeyExists) {
    return null;
  }

  return <EpicLoginAndReport />;
}
