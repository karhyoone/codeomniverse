"use client";

import { useState } from "react";
import { Search, ExternalLink, ChevronDown } from "lucide-react";

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
    ]
  },
  {
    name: "General AI Tools",
    tools: [
      { name: "ChatGPT", link: "https://chat.openai.com", desc: "Conversational AI" },
      { name: "Perplexity AI", link: "https://perplexity.ai", desc: "AI search" },
      { name: "Midjourney", link: "https://midjourney.com", desc: "Image generator" },
      { name: "ElevenLabs", link: "https://elevenlabs.io", desc: "Voice synthesis" },
      { name: "Jasper AI", link: "https://jasper.ai", desc: "Writing assistant" },
    ]
  }
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950 h-screen overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black font-bold text-2xl">C</div>
            <h1 className="text-2xl font-semibold">CodeOmniverse</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-11 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {categories.map((cat) => (
            <div key={cat.name}>
              <button
                onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-zinc-900 rounded-xl text-left font-medium"
              >
                {cat.name}
                <ChevronDown size={18} className={`transition ${openCategory === cat.name ? "rotate-180" : ""}`} />
              </button>

              {openCategory === cat.name && (
                <div className="pl-6 mt-2 space-y-1">
                  {cat.tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2.5 px-4 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition flex justify-between"
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Top Right Suggest Button */}
        <div className="flex justify-end mb-12">
          <a
            href="https://x.com/karhyoon"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition text-sm"
          >
            Suggest a Tool
          </a>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-6xl font-bold tracking-tighter mb-6">
            Welcome to CodeOmniverse
          </h1>
          <p className="text-xl text-zinc-400">
            Your curated hub for the most powerful AI tools.
          </p>
        </div>

        {/* About Us Section - Your exact text */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-8">About CodeOmniverse</h2>
          <div className="prose prose-invert text-zinc-300 leading-relaxed space-y-6">
            <p>
              CodeOmniverse was created for developers who refuse to waste time searching through scattered tools and hype.
            </p>
            <p>
              We cut through the noise and curate only the most powerful, reliable, and impactful AI tools — whether you're writing code, designing interfaces, generating content, or building entire products.
            </p>
            <p>
              Our mission is simple: <strong>Help developers move faster, build better, and stay ahead</strong> in the rapidly evolving world of AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-zinc-900 p-6 rounded-2xl">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="font-semibold mb-2">Curated Excellence</h4>
              <p className="text-sm text-zinc-400">We test and review every tool before adding it. Only the best make the cut.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-semibold mb-2">Built for Speed</h4>
              <p className="text-sm text-zinc-400">We focus on tools that genuinely save time and boost productivity.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl">
              <div className="text-4xl mb-4">🌍</div>
              <h4 className="font-semibold mb-2">For Real Developers</h4>
              <p className="text-sm text-zinc-400">Made by developers, for developers who ship products.</p>
            </div>
          </div>
        </div>

        {/* Center Placeholder for Future Code Generation */}
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Code Generation Area</h3>
          <p className="text-zinc-400">
            This central space will soon support live AI code generation, previews, and more.
          </p>
        </div>
      </main>
    </div>
  );
}