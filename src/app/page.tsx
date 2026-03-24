"use client";

import { useState } from "react";
import { Search, ExternalLink, ArrowRight } from "lucide-react";

const tools = [
  // AI Code Generators
  { name: "Grok 4", category: "Code Generator", link: "https://grok.x.ai", description: "xAI's powerful and truthful AI for coding" },
  { name: "Cursor", category: "Code Generator", link: "https://cursor.com", description: "The AI-first code editor" },
  { name: "GitHub Copilot", category: "Code Generator", link: "https://github.com/features/copilot", description: "AI pair programmer" },
  { name: "Claude", category: "Code Generator", link: "https://claude.ai", description: "Excellent for complex coding" },
  { name: "v0 by Vercel", category: "UI Generation", link: "https://v0.dev", description: "AI UI generator" },
  { name: "Bolt.new", category: "App Builder", link: "https://bolt.new", description: "Instant full-stack app builder" },

  // General AI Tools
  { name: "ChatGPT", category: "General AI", link: "https://chat.openai.com", description: "Popular conversational AI" },
  { name: "Perplexity AI", category: "General AI", link: "https://perplexity.ai", description: "AI search engine" },
  { name: "Midjourney", category: "Image Generation", link: "https://midjourney.com", description: "Best AI image generator" },
  { name: "ElevenLabs", category: "Audio", link: "https://elevenlabs.io", description: "Ultra-realistic AI voice" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation - Cursor style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black font-bold">C</div>
            <span className="text-2xl font-semibold tracking-tight">CodeOmniverse</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#tools" className="hover:text-blue-400 transition">Tools</a>
            <a href="#about" className="hover:text-blue-400 transition">About</a>
            <a href="https://x.com/karhyoon" target="_blank" className="hover:text-blue-400 transition">Contact</a>
          </div>

          <a href="https://x.com/karhyoon" target="_blank" className="text-sm px-5 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition">
            Suggest a Tool
          </a>
        </div>
      </nav>

      {/* Hero Section - Similar to Cursor */}
      <div className="pt-32 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-7xl font-bold tracking-tighter mb-6">
            The home for<br />AI development tools
          </h1>
          <p className="text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Discover, compare, and use the best AI tools to build faster and smarter.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-6 top-4 text-zinc-500" size={24} />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-16 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools" className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-semibold text-center mb-12">Featured AI Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, i) => (
            <div
              key={i}
              className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:bg-zinc-900/80 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                  {tool.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{tool.name}</h3>
                  <p className="text-sm text-zinc-500">{tool.category}</p>
                </div>
              </div>

              <p className="text-zinc-400 mb-8 line-clamp-3">
                {tool.description}
              </p>

              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-1 transition"
              >
                Visit Tool
                <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          CodeOmniverse © 2026 • Curated for developers
        </div>
      </footer>
    </div>
  );
}