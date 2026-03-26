import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { prompt, type, language } = await req.json();

  try {
    if (type === "video") {
      // Using Luma Dream Machine for video generation
      const output = await replicate.run("luma/dream-machine", { input: { prompt } });
      return NextResponse.json({ output });
    }

    if (type === "audio") {
      // Using ElevenLabs or similar via Replicate
      const output = await replicate.run("elevenlabs/elevenlabs-tts", { 
        input: { text: prompt, voice_id: "pMs2gSgnL95rRDf8St6p" } 
      });
      return NextResponse.json({ output });
    }

    // Default: Code Generation (Using your existing GROK/OpenAI logic)
    const res = await fetch("https://api.x.ai", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: `Write ${language} code for: ${prompt}. Return ONLY the code.` }]
      }),
    });
    
    const aiData = await res.json();
    return NextResponse.json({ output: aiData.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { prompt, type, language } = await req.json();

  try {
    if (type === "video") {
      // Using Luma Dream Machine for video generation
      const output = await replicate.run("luma/dream-machine", { input: { prompt } });
      return NextResponse.json({ output });
    }

    if (type === "audio") {
      // Using ElevenLabs or similar via Replicate
      const output = await replicate.run("elevenlabs/elevenlabs-tts", { 
        input: { text: prompt, voice_id: "pMs2gSgnL95rRDf8St6p" } 
      });
      return NextResponse.json({ output });
    }

    // Default: Code Generation (Using your existing GROK/OpenAI logic)
    const res = await fetch("https://api.x.ai", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: `Write ${language} code for: ${prompt}. Return ONLY the code.` }]
      }),
    });
    
    const aiData = await res.json();
    return NextResponse.json({ output: aiData.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
