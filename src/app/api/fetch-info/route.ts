import { NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';
import { ratelimit } from '@/lib/ratelimit';

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const ytDlpWrap = new YTDlpWrap();
    const metadata = await ytDlpWrap.getVideoInfo(url);
    
    // Return a curated set of metadata
    return NextResponse.json({
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      uploader: metadata.uploader,
      duration: metadata.duration,
      view_count: metadata.view_count,
      formats: metadata.formats.filter(f => f.vcodec !== 'none' || f.acodec !== 'none'), // Filter out non-media formats
    });

  } catch (error: any) {
    console.error(error);
    let errorMessage = "Failed to fetch video info.";
    if (error.message) {
        if (error.message.includes("Unsupported URL")) {
            errorMessage = "The provided URL is not supported.";
        } else if (error.message.includes("Video unavailable")) {
            errorMessage = "This video is unavailable. It may be private or deleted.";
        }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
