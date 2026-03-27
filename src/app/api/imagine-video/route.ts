import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a meaningful prompt (at least 5 characters)" }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROK_API_KEY is not configured in Vercel. Please add it." }, { status: 500 });
    }

    // 1. Submit generation request
    const submitRes = await fetch("https://api.x.ai/v1/videos/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-video",
        prompt: prompt.trim(),
        duration: 8,           // seconds (you can change to 5-10)
        aspect_ratio: "16:9",
      }),
    });

    if (!submitRes.ok) {
      const errorText = await submitRes.text();
      console.error("Submit error:", errorText);
      return NextResponse.json({ error: `Submit failed: ${submitRes.status} - ${errorText}` }, { status: submitRes.status });
    }

    const submitData = await submitRes.json();
    const requestId = submitData.request_id || submitData.id;

    if (!requestId) {
      return NextResponse.json({ error: "No request_id received from xAI" }, { status: 500 });
    }

    // 2. Poll for completion (max ~40 seconds)
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

      const statusRes = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });

      if (statusRes.ok) {
        const statusData = await statusRes.json();

        if (statusData.status === "completed" && statusData.video_url) {
          return NextResponse.json({ videoUrl: statusData.video_url });
        }

        if (statusData.status === "failed") {
          return NextResponse.json({ error: statusData.error || "Generation failed" }, { status: 500 });
        }
      }

      attempts++;
    }

    return NextResponse.json({ error: "Generation timed out. Try a shorter or simpler prompt." }, { status: 408 });

  } catch (error: any) {
    console.error("Grok Imagine Video error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}