"use client";

import { useState } from "react";
import { Search, ExternalLink, ChevronDown } from "lucide-react";

const categories = [
  {
    name: "AI Code Generators",
    tools: [
      { name: "Cursor", link: "https://cursor.com", desc: "AI-first code editor" },
      { name: "GitHub Copilot", link: "https://github.com/features/copilot", desc: "AI pair programmer" },
      { name: "Claude", link: "https://claude.ai", desc: "Powerful coding assistant" },
      { name: "v0 by Vercel", link: "https://v0.dev", desc: "UI generator" },
      { name: "Bolt.new", link: "https://bolt.new", desc: "Full-stack app builder" },
    ]
  },
  {
    name: "General AI Tools",
    tools: [
      { name: "ChatGPT", link: "https://chat.openai.com", desc: "Conversational AI" },
      { name: "Gemini", link: "https://gemini.google.com", desc: "Google AI" },
      { name: "Perplexity AI", link: "https://perplexity.ai", desc: "AI search" },
      { name: "Midjourney", link: "https://midjourney.com", desc: "Image generator" },
      { name: "ElevenLabs", link: "https://elevenlabs.io", desc: "Voice synthesis" },
    ]
  }
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center text-black font-bold text-2xl">C</div>
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

        <div className="flex-1 p-4">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-900 rounded-xl transition text-left"
              >
                <span className="font-medium">{category.name}</span>
                <ChevronDown size={18} className={`transition ${openCategory === category.name ? "rotate-180" : ""}`} />
              </button>

              {openCategory === category.name && (
                <div className="pl-4 mt-1 space-y-1">
                  {category.tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition"
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
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Welcome to CodeOmniverse
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            Select a tool from the sidebar to get started.<br />
            The center area will soon support code generation and previews.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12">
            <p className="text-zinc-500">
              This space is reserved for future features like AI code generation, live previews, and more.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}