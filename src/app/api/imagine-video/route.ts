import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROK_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.x.ai/v1/images/generations", {  // Grok Imagine video endpoint (adjust if exact path changes)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-video",   // or "grok-imagine-image" if video not directly available
        prompt: prompt,
        // You can add more params like duration, style later
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `API error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    // Adjust according to actual response format (usually data.video_url or data.url)
    const videoUrl = data.video_url || data.url || data.output?.[0]?.url;

    return NextResponse.json({ videoUrl });

  } catch (error: any) {
    console.error("Imagine Video error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate video" }, { status: 500 });
  }
}