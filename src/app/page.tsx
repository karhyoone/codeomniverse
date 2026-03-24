"use client";

import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";

const codeGenerators = [
  {
    name: "Grok 4",
    description: "xAI's most powerful model - truthful, helpful, and great at coding.",
    category: "Code Generator",
    link: "https://grok.x.ai",
    rating: 4.8,
    color: "bg-black",
  },
  {
    name: "Cursor",
    description: "AI-first code editor that writes and edits code with you.",
    category: "Code Generator",
    link: "https://cursor.com/?ref=codeomniverse",
    rating: 4.9,
    color: "bg-blue-500",
  },
  {
    name: "GitHub Copilot",
    description: "Best real-time AI coding assistant inside your editor.",
    category: "Code Generator",
    link: "https://github.com/features/copilot",
    rating: 4.7,
    color: "bg-purple-500",
  },
  {
    name: "Claude 4",
    description: "Excellent at complex coding tasks and long-context reasoning.",
    category: "Code Generator",
    link: "https://claude.ai",
    rating: 4.8,
    color: "bg-orange-500",
  },
];

const devTools = [
  {
    name: "v0 by Vercel",
    description: "Instantly generate beautiful React + Tailwind UI from text.",
    category: "UI Generation",
    link: "https://v0.dev",
    rating: 4.6,
    color: "bg-pink-500",
  },
  {
    name: "Bolt.new",
    description: "Build full-stack apps in seconds using AI in the browser.",
    category: "App Builder",
    link: "https://bolt.new",
    rating: 4.5,
    color: "bg-green-500",
  },
  {
    name: "Aider",
    description: "AI coding directly in your terminal - edit files with chat.",
    category: "Terminal Tool",
    link: "https://aider.chat",
    rating: 4.5,
    color: "bg-amber-500",
  },
  {
    name: "Continue.dev",
    description: "Open-source AI autopilot for VS Code & JetBrains.",
    category: "IDE Extension",
    link: "https://continue.dev",
    rating: 4.6,
    color: "bg-red-500",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const allTools = [...codeGenerators, ...devTools];

  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl">C</span>
            </div>
            <h1 className="text-3xl font-bold">CodeOmniverse</h1>
          </div>
          <div className="text-sm text-zinc-400">AI Tools for Developers</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4">CodeOmniverse</h2>
          <p className="text-2xl text-zinc-400">Your hub for the best AI coding tools</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* AI Code Generators Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            🔥 AI Code Generators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeGenerators.map((tool, i) => (
              <div key={i} className="group bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:bg-zinc-900 transition-all hover:-translate-y-1">
                {/* Card content same as before */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold`}>
                    {tool.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-2xl">{tool.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs bg-zinc-800 rounded-full mt-1">{tool.category}</span>
                  </div>
                  <div className="text-amber-400">★ {tool.rating}</div>
                </div>
                <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-200 transition-all">
                  Visit Tool <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* AI Developer Tools Section */}
        <div>
          <h3 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            🛠️ AI Developer Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devTools.map((tool, i) => (
              <div key={i} className="group bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:bg-zinc-900 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold`}>
                    {tool.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-2xl">{tool.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs bg-zinc-800 rounded-full mt-1">{tool.category}</span>
                  </div>
                  <div className="text-amber-400">★ {tool.rating}</div>
                </div>
                <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-200 transition-all">
                  Visit Tool <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>CodeOmniverse © 2026 • Curated with ❤️ for developers</p>
        </div>
      </footer>
    </div>
  );
}