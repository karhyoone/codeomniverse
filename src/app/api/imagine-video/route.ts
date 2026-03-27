import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Valid prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROK_API_KEY is not set in Vercel environment variables" }, { status: 500 });
    }

    // Submit the generation request (async)
    const submitRes = await fetch("https://api.x.ai/v1/video/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-video",
        prompt: prompt,
        duration: 8,           // seconds (adjust as needed)
        aspect_ratio: "16:9",
      }),
    });

    if (!submitRes.ok) {
      const errorText = await submitRes.text();
      return NextResponse.json({ error: `Submit failed: ${submitRes.status} - ${errorText}` }, { status: submitRes.status });
    }

    const submitData = await submitRes.json();
    const requestId = submitData.request_id;

    if (!requestId) {
      return NextResponse.json({ error: "No request_id received from API" }, { status: 500 });
    }

    // Poll for completion (simple polling - up to ~30 seconds)
    let attempts = 0;
    const maxAttempts = 15; // ~30 seconds

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

      const statusRes = await fetch(`https://api.x.ai/v1/video/status/${requestId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });

      if (!statusRes.ok) continue;

      const statusData = await statusRes.json();

      if (statusData.status === "completed" && statusData.video_url) {
        return NextResponse.json({ videoUrl: statusData.video_url });
      }

      if (statusData.status === "failed") {
        return NextResponse.json({ error: statusData.error || "Generation failed" }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ error: "Generation timed out. Try a simpler prompt." }, { status: 408 });

  } catch (error: any) {
    console.error("Grok Imagine Video error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}