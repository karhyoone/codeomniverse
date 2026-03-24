"use client";

import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";

const codeGenerators = [
  { name: "Grok 4", description: "xAI's flagship model - truthful, fast, and highly capable at coding tasks.", category: "Code Generator", link: "https://grok.x.ai", rating: 4.8, color: "bg-black" },
  { name: "Cursor", description: "The AI-first code editor that feels like having a senior developer by your side.", category: "Code Generator", link: "https://cursor.com/?ref=codeomniverse", rating: 4.9, color: "bg-blue-500" },
  { name: "GitHub Copilot", description: "The most popular AI coding assistant integrated in VS Code.", category: "Code Generator", link: "https://github.com/features/copilot", rating: 4.7, color: "bg-purple-500" },
  { name: "Claude 4", description: "Outstanding at complex coding, reasoning, and large projects.", category: "Code Generator", link: "https://claude.ai", rating: 4.8, color: "bg-orange-500" },
  { name: "Windsurf", description: "Next-generation AI code editor built by Codeium.", category: "Code Generator", link: "https://windsurf.com", rating: 4.4, color: "bg-violet-500" },
];

const devTools = [
  { name: "v0 by Vercel", description: "Turn text prompts into production-ready Tailwind UI components.", category: "UI Generation", link: "https://v0.dev", rating: 4.6, color: "bg-pink-500" },
  { name: "Bolt.new", description: "Create full-stack apps instantly using AI in the browser.", category: "App Builder", link: "https://bolt.new", rating: 4.5, color: "bg-green-500" },
  { name: "Aider", description: "AI-powered coding in your terminal - edit multiple files with chat.", category: "Terminal Tool", link: "https://aider.chat", rating: 4.5, color: "bg-amber-500" },
  { name: "Continue.dev", description: "Open-source AI coding autopilot for VS Code and JetBrains.", category: "IDE Extension", link: "https://continue.dev", rating: 4.6, color: "bg-red-500" },
  { name: "Replit AI", description: "Powerful AI assistant built directly into Replit.", category: "Coding Assistant", link: "https://replit.com/ai", rating: 4.4, color: "bg-cyan-500" },
  { name: "Blackbox AI", description: "Fast AI coding assistant with excellent code search.", category: "Coding Assistant", link: "https://blackbox.ai", rating: 4.3, color: "bg-zinc-500" },
];

const allTools = [...codeGenerators, ...devTools];

const categories = ["All", "Code Generator", "UI Generation", "App Builder", "IDE Extension", "Terminal Tool", "Coding Assistant"];

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">C</div>
            <h1 className="text-3xl font-bold tracking-tight">CodeOmniverse</h1>
          </div>
          <div className="text-sm text-zinc-400">AI Tools Hub for Developers</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold tracking-tighter mb-4">CodeOmniverse</h2>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">Discover the best AI tools to supercharge your development workflow</p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative mb-8">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Code Generators Section */}
        <div className="mb-20">
          <h3 className="text-4xl font-semibold mb-10 text-center">🔥 AI Code Generators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {codeGenerators.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-4xl font-bold text-white`}>{tool.name[0]}</div>
                  <div className="text-amber-400 text-xl">★ {tool.rating}</div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-100 transition-all">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Tools Section */}
        <div>
          <h3 className="text-4xl font-semibold mb-10 text-center">🛠️ AI Developer Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devTools.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-4xl font-bold text-white`}>{tool.name[0]}</div>
                  <div className="text-amber-400 text-xl">★ {tool.rating}</div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-100 transition-all">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-800 bg-black py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500">
          CodeOmniverse © 2026 • Curated for developers
        </div>
      </footer>
    </div>
  );
}