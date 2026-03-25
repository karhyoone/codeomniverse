"use client";

import { useState } from "react";
import { Search, ExternalLink, ChevronDown, Info } from "lucide-react";

const categories = [
  {
    name: "AI Code Generators",
    tools: [
      { name: "Grok 4", link: "https://grok.x.ai", desc: "xAI's powerful AI" },
      { name: "Cursor", link: "https://cursor.com", desc: "AI-first code editor" },
      { name: "GitHub Copilot", link: "https://github.com/features/copilot", desc: "AI pair programmer" },
      { name: "Claude", link: "https://claude.ai", desc: "Excellent for coding" },
      { name: "v0 by Vercel", link: "https://v0.dev", desc: "UI generator" },
      { name: "Bolt.new", link: "https://bolt.new", desc: "App builder" },
      { name: "Replit Agent", link: "https://replit.com/ai", desc: "AI agent" },
      { name: "Codeium", link: "https://codeium.com", desc: "Fast AI coding" },
      { name: "Tabnine", link: "https://tabnine.com", desc: "AI code completion" },
    ]
  },
  {
    name: "General AI Tools",
    tools: [
      { name: "ChatGPT", link: "https://chat.openai.com", desc: "Conversational AI" },
      { name: "Perplexity AI", link: "https://perplexity.ai", desc: "AI search" },
      { name: "Gemini", link: "https://gemini.google.com", desc: "Google AI" },
      { name: "Microsoft Copilot", link: "https://copilot.microsoft.com", desc: "Microsoft AI" },
    ]
  },
  {
    name: "Video Generators & Editors",
    tools: [
      { name: "Synthesia", link: "https://synthesia.io", desc: "AI video with avatars" },
      { name: "Runway", link: "https://runwayml.com", desc: "Advanced video generation" },
      { name: "HeyGen", link: "https://heygen.com", desc: "AI avatar videos" },
      { name: "Descript", link: "https://descript.com", desc: "AI video & audio editing" },
      { name: "Lumen5", link: "https://lumen5.com", desc: "Text to video" },
      { name: "Sora", link: "https://openai.com/sora", desc: "OpenAI video generation" },
    ]
  },
  {
    name: "Audio Generators & Editors",
    tools: [
      { name: "ElevenLabs", link: "https://elevenlabs.io", desc: "Ultra-realistic voice" },
      { name: "Murf AI", link: "https://murf.ai", desc: "AI voiceover studio" },
      { name: "Descript", link: "https://descript.com", desc: "AI audio editing" },
    ]
  },
  {
    name: "Image Generators",
    tools: [
      { name: "Midjourney", link: "https://midjourney.com", desc: "Best AI image generator" },
      { name: "DALL·E 3", link: "https://chat.openai.com", desc: "OpenAI image generation" },
      { name: "Leonardo.ai", link: "https://leonardo.ai", desc: "Powerful AI art platform" },
      { name: "Adobe Firefly", link: "https://firefly.adobe.com", desc: "Adobe AI images" },
      { name: "Canva Magic Studio", link: "https://canva.com", desc: "AI design tools" },
    ]
  },
  {
    name: "Writing Tools",
    tools: [
      { name: "Jasper AI", link: "https://jasper.ai", desc: "AI writing assistant" },
      { name: "Copy.ai", link: "https://copy.ai", desc: "Fast copywriting" },
      { name: "Rytr", link: "https://rytr.me", desc: "Affordable AI writer" },
      { name: "Writesonic", link: "https://writesonic.com", desc: "SEO + AI writing" },
      { name: "Grammarly", link: "https://grammarly.com", desc: "AI writing & grammar" },
    ]
  }
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#3b82f610_0%,transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,#a855f710_0%,transparent_60%)] animate-pulse delay-1000" />

      {/* Left Sidebar */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-xl flex flex-col h-screen overflow-y-auto z-10">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
            <h1 className="text-2xl font-semibold tracking-tight">CodeOmniverse</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-11 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.name}>
              <button
                onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-zinc-900 rounded-xl text-left font-medium transition"
              >
                {cat.name}
                <ChevronDown size={18} className={`transition ${openCategory === cat.name ? "rotate-180" : ""}`} />
              </button>

              {openCategory === cat.name && (
                <div className="pl-6 mt-1 space-y-1">
                  {cat.tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2.5 px-4 text-sm text-zinc-300 hover:text-blue-400 hover:bg-zinc-900 rounded-xl transition flex justify-between"
                    >
                      {tool.name}
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* About Button at Bottom Left */}
        <div className="p-6 border-t border-zinc-800 mt-auto">
          <button
            onMouseEnter={() => setShowAbout(true)}
            onMouseLeave={() => setShowAbout(false)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition w-full px-4 py-3 hover:bg-zinc-900 rounded-xl"
          >
            <Info size={18} />
            About CodeOmniverse
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <div className="flex justify-end mb-12">
          <a
            href="https://x.com/karhyoon"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition text-sm"
          >
            Suggest a Tool
          </a>
        </div>

        <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6 opacity-80">🚀</div>
            <h2 className="text-4xl font-semibold mb-4">Ready to Build</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Choose a tool from the sidebar.<br />
              The center area will soon support code generation and previews.
            </p>
          </div>
        </div>
      </main>

      {/* About Popup on Hover */}
      {showAbout && (
        <div 
          className="fixed bottom-28 left-80 bg-zinc-900/95 border border-zinc-700 backdrop-blur-2xl rounded-3xl p-10 max-w-md shadow-2xl z-50"
          onMouseEnter={() => setShowAbout(true)}
          onMouseLeave={() => setShowAbout(false)}
        >
          <h2 className="text-2xl font-semibold mb-6">About CodeOmniverse</h2>
          <div className="text-zinc-300 leading-relaxed space-y-6 text-[15px]">
            <p>
              CodeOmniverse was created for developers who refuse to waste time searching through scattered tools and hype.
            </p>
            <p>
              We cut through the noise and curate only the most powerful, reliable, and impactful AI tools — whether you're writing code, designing interfaces, generating content, or building entire products.
            </p>
            <p>
              Our mission is simple: Help developers move faster, build better, and stay ahead in the rapidly evolving world of AI.
            </p>

            <div className="pt-6 border-t border-zinc-700 grid grid-cols-1 gap-6">
              <div>
                <div className="text-blue-400 text-2xl mb-2">🔍</div>
                <strong>Curated Excellence</strong>
                <p className="text-sm text-zinc-400 mt-1">We test and review every tool before adding it. Only the best make the cut.</p>
              </div>
              <div>
                <div className="text-blue-400 text-2xl mb-2">⚡</div>
                <strong>Built for Speed</strong>
                <p className="text-sm text-zinc-400 mt-1">We focus on tools that genuinely save time and boost productivity.</p>
              </div>
              <div>
                <div className="text-blue-400 text-2xl mb-2">🌍</div>
                <strong>For Real Developers</strong>
                <p className="text-sm text-zinc-400 mt-1">Made by developers, for developers who ship products.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}