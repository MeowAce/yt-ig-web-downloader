"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { InputForm } from "@/components/input-form";
import { ResultsCard } from "@/components/results-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Define a type for the video metadata for type safety
export type VideoInfo = {
  url: string;
  title: string;
  thumbnail: string;
  uploader?: string;
  duration?: number;
  view_count?: number;
  formats: Array<{
    format_id: string;
    ext: string;
    resolution?: string;
    vcodec?: string;
    acodec?: string;
    filesize?: number;
    format_note?: string;
  }>;
};

export default function HomePage() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (url: string) => {
    if (!url) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const response = await fetch(`/api/fetch-info?url=${encodeURIComponent(url)}`);

      // Handle non-OK responses first
      if (!response.ok) {
        // Try to parse the error message from the JSON body, but don't crash if it's not JSON
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `A server error occurred (status: ${response.status})`);
      }

      // If response is OK, parse the successful data
      const data = await response.json();
      setVideoInfo({ ...data, url });
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <InputForm onFetch={handleFetch} loading={loading} />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {videoInfo && <ResultsCard videoInfo={videoInfo} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}