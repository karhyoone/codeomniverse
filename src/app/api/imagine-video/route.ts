import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a meaningful prompt" }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROK_API_KEY is not set in Vercel" }, { status: 500 });
    }

    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt: prompt.trim(),
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `API error: ${res.status} - ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url || data.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL returned from Grok" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error("Grok Imagine Image error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
  }
}