"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface InputFormProps {
  onFetch: (url: string) => void;
  loading: boolean;
}

export function InputForm({ onFetch, loading }: InputFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(url);
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">YouTube & Instagram Downloader</h1>
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
        <Input
          type="url"
          placeholder="Paste a YouTube or Instagram link here"
          className="flex-1 p-2 border rounded-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" className="p-2 bg-blue-600 text-white rounded-lg" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Download"}
        </Button>
      </form>
    </div>
  );
}