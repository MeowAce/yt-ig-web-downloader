import { NextRequest, NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';
import { PassThrough } from 'stream';
import { Readable } from 'stream'; // Import Readable
import { ratelimit } from '@/lib/ratelimit';

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const formatId = searchParams.get('formatId');

  if (!url || !formatId) {
    return NextResponse.json({ error: 'URL and Format ID are required' }, { status: 400 });
  }

  try {
    const ytDlpWrap = new YTDlpWrap();

    // Get video info to suggest a filename before streaming
    const metadata = await ytDlpWrap.getVideoInfo(url);
    const extension = metadata.ext || 'mp4';
    const filename = `${metadata.title}.${extension}`.replace(/[^a-z0-9\.\_\-]/gi, '_'); // Sanitize filename

    // Use execStream to get a readable stream directly
    const videoStream = ytDlpWrap.execStream([
        url,
        '-f', formatId,
        '-o', '-' // Output to stdout
    ]);

    // Convert Node.js stream to Web ReadableStream
    const webStream = Readable.toWeb(videoStream) as ReadableStream<Uint8Array>;

    // Return a streaming response
    return new NextResponse(webStream, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/octet-stream',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to download video' }, { status: 500 });
  }
}
