"use client";

import { useState } from "react";
import { Search, ExternalLink, Star, Plus } from "lucide-react";

const codeGenerators = [
  { name: "Grok 4", description: "xAI's most advanced model - truthful, helpful, and great at coding.", category: "Code Generator", link: "https://grok.x.ai", rating: 4.8, color: "bg-black" },
  { name: "Cursor", description: "The AI-first code editor that writes and refactors code with you.", category: "Code Generator", link: "https://cursor.com/?ref=codeomniverse", rating: 4.9, color: "bg-blue-500" },
  { name: "GitHub Copilot", description: "Industry-leading AI pair programmer inside VS Code.", category: "Code Generator", link: "https://github.com/features/copilot", rating: 4.7, color: "bg-purple-500" },
  { name: "Claude 4", description: "Excellent at complex reasoning and large codebases.", category: "Code Generator", link: "https://claude.ai", rating: 4.8, color: "bg-orange-500" },
];

const devTools = [
  { name: "v0 by Vercel", description: "Generate production-ready UI from text.", category: "UI Generation", link: "https://v0.dev", rating: 4.6, color: "bg-pink-500" },
  { name: "Bolt.new", description: "Build full-stack apps instantly with AI.", category: "App Builder", link: "https://bolt.new", rating: 4.5, color: "bg-green-500" },
  { name: "Aider", description: "AI coding in your terminal.", category: "Terminal Tool", link: "https://aider.chat", rating: 4.5, color: "bg-amber-500" },
  { name: "Continue.dev", description: "Open-source AI autopilot for VS Code.", category: "IDE Extension", link: "https://continue.dev", rating: 4.6, color: "bg-red-500" },
];

const allTools = [...codeGenerators, ...devTools];

const categories = ["All", "Code Generator", "UI Generation", "App Builder", "IDE Extension", "Terminal Tool"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
            <h1 className="text-3xl font-bold">CodeOmniverse</h1>
          </div>
          <div className="text-sm text-zinc-400">Discover • Compare • Build Faster</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold tracking-tight mb-4">CodeOmniverse</h2>
          <p className="text-2xl text-zinc-400">Your curated hub for AI coding tools</p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative mb-6">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? "bg-blue-600 text-white" : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, i) => (
            <div key={i} className="group bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:bg-zinc-900 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold`}>{tool.name[0]}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-2xl">{tool.name}</h3>
                  <span className="inline-block px-3 py-1 text-xs bg-zinc-800 rounded-full mt-1">{tool.category}</span>
                </div>
                <div className="text-amber-400">★ {tool.rating}</div>
              </div>
              <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
              <a href={tool.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-200 transition-all group-hover:scale-105">
                Visit Tool <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>

        {/* Suggest a Tool */}
        <div className="mt-24 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center">
          <Plus className="mx-auto mb-4 text-blue-400" size={48} />
          <h3 className="text-3xl font-semibold mb-3">Suggest a Tool</h3>
          <p className="text-zinc-400 mb-6">Know a great AI tool that should be here?</p>
          <a
            href="https://x.com/karhyoon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-medium"
          >
            Message me on X
          </a>
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