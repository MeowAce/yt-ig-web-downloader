"use client";

import { useState } from "react";
import { VideoInfo } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Download, Clock, User, Eye, Loader2 } from "lucide-react";
import { formatDuration, formatViewCount } from "@/lib/utils";

interface ResultsCardProps {
  videoInfo: VideoInfo;
}

export function ResultsCard({ videoInfo }: ResultsCardProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (formatId: string) => {
    setDownloading(formatId);
    const downloadUrl = `/api/download?url=${encodeURIComponent(videoInfo.url)}&formatId=${formatId}`;
    window.open(downloadUrl, '_blank');
    // Reset the button state after a short delay
    setTimeout(() => setDownloading(null), 3000);
  };

  return (
    <Card className="mt-6 overflow-hidden transition-all duration-300 ease-in-out">
      <CardHeader className="p-4 bg-gray-100 dark:bg-gray-800 border-b">
        <CardTitle className="text-lg text-center">{videoInfo.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/3 flex-shrink-0 relative">
            <Image 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title} 
                width={320} 
                height={180} 
                className="rounded-lg object-cover w-full"
            />
            {videoInfo.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(videoInfo.duration)}
                </div>
            )}
          </div>
          <div className="w-full md:w-2/3 space-y-3">
            {videoInfo.uploader && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <span>{videoInfo.uploader}</span>
                </div>
            )}
            {videoInfo.view_count !== undefined && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{formatViewCount(videoInfo.view_count)} views</span>
                </div>
            )}
            <div>
              <h3 className="font-semibold mb-2 text-base">Available Formats:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {videoInfo.formats.map((format) => (
                  <Button 
                    key={format.format_id} 
                    variant="outline" 
                    onClick={() => handleDownload(format.format_id)}
                    disabled={downloading === format.format_id}
                    className="w-full justify-center transition-all duration-200 ease-in-out"
                  >
                    {downloading === format.format_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    {format.ext} {format.resolution ? `- ${format.resolution}` : ''}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}