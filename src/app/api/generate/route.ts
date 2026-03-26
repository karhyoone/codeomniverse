// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json({ error: "Missing prompt or language" }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "GROK_API_KEY is not configured. Please add it in Vercel Environment Variables." 
      }, { status: 500 });
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4",
        messages: [
          {
            role: "system",
            content: `You are an expert programmer. Generate clean, well-commented code in ${language}. Return ONLY the code, no explanations, no markdown.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    const code = data.choices?.[0]?.message?.content || "// No code was generated.";

    return NextResponse.json({ code });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to generate code" 
    }, { status: 500 });
  }
}