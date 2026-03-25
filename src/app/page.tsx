"use client";

import { useState } from "react";
import { ChevronDown, Search, ExternalLink } from "lucide-react";

const categories = [
  {
    name: "AI Code Generators",
    tools: [
      { name: "Cursor", link: "https://cursor.com", desc: "AI-first editor" },
      { name: "GitHub Copilot", link: "https://github.com/features/copilot", desc: "Pair programmer" },
      { name: "v0", link: "https://v0.dev", desc: "UI from text" },
      { name: "Bolt.new", link: "https://bolt.new", desc: "App builder" }, { name: "ChatGPT", link: "https://chat.openai.com", desc: "Conversational AI" },
      { name: "Claude", link: "https://claude.ai", desc: "Thoughtful assistant" },
      { name: "Gemini", link: "https://gemini.google.com", desc: "Multimodal" },
      { name: "Perplexity", link: "https://perplexity.ai", desc: "Search + citations" }, { name: "Midjourney", link: "https://midjourney.com", desc: "Image gen" },
      { name: "ElevenLabs", link: "https://elevenlabs.io", desc: "Voice synth" },
    ]
  }
];

export default function Home() {
  const = useState<string | null>(null);
  const = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar - Fixed width */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen overflow-y-auto">
        {/* Logo + Search */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black font-bold">C</div>
            <span className="text-2xl font-semibold">CodeOmniverse</span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dropdown Categories */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {categories.map(cat => (
            <div key={cat.name}>
              <button
                onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-zinc-900 transition text-left"
              >
                <span className="font-medium">{cat.name}</span>
                <ChevronDown size={16} className={`transition ${openCategory === cat.name ? "rotate-180" : ""}`} />
              </button>

              {openCategory === cat.name && (
                <div className="mt-1 space-y-1 pl-4">
                  {cat.tools.map(tool => (
                    <a
                      key={tool.name}
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2 px-4 text-sm text-zinc-300 hover:text-blue-400 hover:bg-zinc-900 rounded-md transition flex justify-between items-center"
                    >
                      {tool.name}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area - Flexible, for future code gen / previews */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold tracking-tight mb-6">
          Welcome to CodeOmniverse
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-12">
          Select a tool from the left sidebar — or start building something here soon.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 max-w-3xl w-full text-left">
          <p className="text-zinc-500 italic"> </p>
        </div>
      </main>
    </div>
  );
}