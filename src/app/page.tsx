"use client";

import { useState } from "react";
import { Search, ExternalLink, Star, } from "lucide-react";

const tools = [
  {
    name: "Cursor",
    description: "The AI-first code editor loved by developers worldwide.",
    category: "Code Editor",
    link: "https://cursor.com/?ref=codeomniverse",
    rating: 4.9,
    color: "bg-blue-500",
  },
  {
    name: "GitHub Copilot",
    description: "Your AI pair programmer that suggests code in real-time.",
    category: "Coding Assistant",
    link: "https://github.com/features/copilot",
    rating: 4.7,
    color: "bg-purple-500",
  },
  {
    name: "Claude Projects",
    description: "Powerful AI coding agent with excellent reasoning.",
    category: "Coding Assistant",
    link: "https://claude.ai",
    rating: 4.8,
    color: "bg-orange-500",
  },
  {
    name: "v0 by Vercel",
    description: "Generate beautiful UI components from text prompts.",
    category: "UI/Design",
    link: "https://v0.dev",
    rating: 4.6,
    color: "bg-pink-500",
  },
  {
    name: "Bolt.new",
    description: "Build full-stack apps instantly with AI in your browser.",
    category: "App Builder",
    link: "https://bolt.new",
    rating: 4.5,
    color: "bg-green-500",
  },
  {
    name: "Replit AI",
    description: "AI coding assistant inside the popular online IDE.",
    category: "Coding Assistant",
    link: "https://replit.com/ai",
    rating: 4.4,
    color: "bg-cyan-500",
  },
  {
    name: "Windsurf",
    description: "Next-generation AI code editor by Codeium.",
    category: "Code Editor",
    link: "https://windsurf.com",
    rating: 4.3,
    color: "bg-violet-500",
  },
  {
    name: "Aider",
    description: "AI coding in your terminal - edit files with natural language.",
    category: "Terminal Tool",
    link: "https://aider.chat",
    rating: 4.5,
    color: "bg-amber-500",
  },
  {
    name: "Continue.dev",
    description: "Open-source autopilot for VS Code and JetBrains.",
    category: "IDE Extension",
    link: "https://continue.dev",
    rating: 4.6,
    color: "bg-red-500",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
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
          <div className="text-sm text-zinc-400">Discover • Compare • Build Faster</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4 tracking-tight">
            The Ultimate AI Tools Directory
          </h2>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
            Handpicked AI tools to help developers code faster and smarter
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search tools, categories... (e.g. editor, UI, assistant)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, i) => (
            <div
              key={i}
              className="group bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold`}>
                  {tool.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-2xl">{tool.name}</h3>
                  <span className="inline-block px-3 py-1 text-xs bg-zinc-800 rounded-full mt-1">
                    {tool.category}
                  </span>
                </div>
                <div className="flex items-center text-amber-400">
                  ★ {tool.rating}
                </div>
              </div>

              <p className="text-zinc-400 mb-8 line-clamp-3 text-[15px]">
                {tool.description}
              </p>

              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-200 transition-all group-hover:scale-105"
              >
                Visit Tool
                <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>CodeOmniverse © 2026 • Curated with ❤️ for developers</p>
          <p className="mt-2">
            Have a tool to suggest? Reach out on X @karhyoone
          </p>
        </div>
      </footer>
    </div>
  );
}