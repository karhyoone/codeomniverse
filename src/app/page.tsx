"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";

const generalAITools = [
  { name: "ChatGPT", description: "OpenAI's most popular conversational AI.", category: "General AI", link: "https://chat.openai.com" },
  { name: "Claude", description: "Anthropic's thoughtful and powerful AI assistant.", category: "General AI", link: "https://claude.ai" },
  { name: "Gemini", description: "Google's advanced multimodal AI model.", category: "General AI", link: "https://gemini.google.com" },
  { name: "Perplexity AI", description: "AI search engine with accurate citations.", category: "General AI", link: "https://perplexity.ai" },
  { name: "Microsoft Copilot", description: "AI assistant integrated across Microsoft products.", category: "General AI", link: "https://copilot.microsoft.com" },
  { name: "Jasper AI", description: "AI writing assistant for marketing and content.", category: "Writing", link: "https://jasper.ai" },
  { name: "Copy.ai", description: "Fast AI copywriting tool.", category: "Writing", link: "https://copy.ai" },
  { name: "Writesonic", description: "AI writer with SEO features.", category: "Writing", link: "https://writesonic.com" },
  { name: "Midjourney", description: "Leading AI image generation tool.", category: "Image Generation", link: "https://midjourney.com" },
  { name: "ElevenLabs", description: "Ultra-realistic AI voice synthesis.", category: "Audio", link: "https://elevenlabs.io" },
  { name: "Notion AI", description: "AI features built into Notion.", category: "Productivity", link: "https://notion.so" },
];

const codeGenerators = [
  { name: "GitHub Copilot", description: "The most popular AI coding assistant.", category: "Code Generator", link: "https://github.com/features/copilot" },
  { name: "Cursor", description: "AI-first code editor that feels like pair programming with a genius.", category: "Code Generator", link: "https://cursor.com" },
  { name: "Claude Code", description: "Excellent for complex coding tasks.", category: "Code Generator", link: "https://claude.ai" },
  { name: "v0 by Vercel", description: "Generate beautiful UI components from text.", category: "Code Generator", link: "https://v0.dev" },
  { name: "Bolt.new", description: "Instant full-stack app builder with AI.", category: "Code Generator", link: "https://bolt.new" },
  { name: "Replit Agent", description: "AI agent that builds apps in Replit.", category: "Code Generator", link: "https://replit.com/ai" },
  { name: "Codeium", description: "Fast AI coding assistant.", category: "Code Generator", link: "https://codeium.com" },
  { name: "Tabnine", description: "AI code completion for all major IDEs.", category: "Code Generator", link: "https://tabnine.com" },
];

const allTools = [...generalAITools, ...codeGenerators];

const categories = ["All", "Code Generator", "General AI", "Writing", "Image Generation", "Audio", "Productivity"];

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold mb-3">CodeOmniverse</h1>
          <p className="text-lg text-zinc-400">Curated collection of the best AI tools</p>
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
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? "bg-blue-600 text-white" 
                  : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Code Generators */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold mb-8 text-center">🔥 AI Code Generators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeGenerators.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all">
                <h4 className="text-xl font-semibold mb-2">{tool.name}</h4>
                <p className="text-zinc-400 mb-6 line-clamp-3 text-sm">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" 
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium text-sm">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* General AI Tools */}
        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center">🌐 General AI Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalAITools.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all">
                <h4 className="text-xl font-semibold mb-2">{tool.name}</h4>
                <p className="text-zinc-400 mb-6 line-clamp-3 text-sm">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" 
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium text-sm">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}