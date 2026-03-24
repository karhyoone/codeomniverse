"use client";

import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";

const generalAITools = [
  { name: "ChatGPT", description: "OpenAI's flagship conversational AI.", category: "General AI", link: "https://chat.openai.com", rating: 4.7, color: "from-green-500 to-emerald-600" },
  { name: "Claude", description: "Anthropic's thoughtful and powerful AI.", category: "General AI", link: "https://claude.ai", rating: 4.8, color: "from-orange-500 to-amber-600" },
  { name: "Gemini", description: "Google's advanced multimodal AI.", category: "General AI", link: "https://gemini.google.com", rating: 4.6, color: "from-blue-500 to-cyan-600" },
  { name: "Perplexity AI", description: "AI search engine with citations.", category: "General AI", link: "https://perplexity.ai", rating: 4.7, color: "from-purple-500 to-violet-600" },
  { name: "Midjourney", description: "Best AI image generation tool.", category: "Image Generation", link: "https://midjourney.com", rating: 4.8, color: "from-pink-500 to-rose-600" },
  { name: "ElevenLabs", description: "Ultra-realistic AI voice synthesis.", category: "Audio", link: "https://elevenlabs.io", rating: 4.9, color: "from-rose-500 to-red-600" },
];

const codeGenerators = [
  { name: "Grok 4", description: "xAI's powerful and truthful AI for coding.", category: "Code Generator", link: "https://grok.x.ai", rating: 4.8, color: "from-black to-zinc-900" },
  { name: "Cursor", description: "AI-first code editor loved by developers.", category: "Code Generator", link: "https://cursor.com/?ref=codeomniverse", rating: 4.9, color: "from-blue-600 to-indigo-600" },
  { name: "GitHub Copilot", description: "Real-time AI pair programmer.", category: "Code Generator", link: "https://github.com/features/copilot", rating: 4.7, color: "from-purple-600 to-violet-600" },
  { name: "Claude Code", description: "Excellent for complex coding tasks.", category: "Code Generator", link: "https://claude.ai", rating: 4.8, color: "from-orange-600 to-amber-600" },
  { name: "v0 by Vercel", description: "AI UI generator from text.", category: "UI Generation", link: "https://v0.dev", rating: 4.6, color: "from-pink-600 to-rose-600" },
  { name: "Bolt.new", description: "Instant full-stack app builder.", category: "App Builder", link: "https://bolt.new", rating: 4.5, color: "from-green-600 to-emerald-600" },
];

const allTools = [...generalAITools, ...codeGenerators];

const categories = ["All", "Code Generator", "General AI", "Image Generation", "Audio", "UI Generation", "App Builder"];

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden relative">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#3b82f610_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,#a855f710_0%,transparent_50%)]"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
            <h1 className="text-3xl font-semibold tracking-tight">CodeOmniverse</h1>
          </div>
          <p className="text-sm text-zinc-400">AI Tools Hub</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-20 relative">
        {/* Hero */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold tracking-tighter mb-6">Discover the Future of AI</h2>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">Curated collection of the best AI tools for developers and creators</p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-6 top-5 text-zinc-500" size={24} />
            <input
              type="text"
              placeholder="Search any AI tool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-3xl pl-16 py-5 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500 backdrop-blur-xl"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all backdrop-blur-xl ${
                activeCategory === cat 
                  ? "bg-white text-black shadow-xl" 
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, i) => (
            <div
              key={i}
              className="group bg-zinc-900/70 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:border-blue-500/50 hover:bg-zinc-900/90 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className={`w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-5xl font-bold text-white shadow-inner`}>
                {tool.name[0]}
              </div>
              <h4 className="text-2xl font-semibold mb-3 tracking-tight">{tool.name}</h4>
              <p className="text-zinc-400 mb-10 line-clamp-3 leading-relaxed">{tool.description}</p>
              
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-1 transition"
              >
                Visit Tool 
                <ExternalLink size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl py-16 mt-32">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500">
          CodeOmniverse © 2026 • Curated with passion for developers
        </div>
      </footer>
    </div>
  );
}