"use client";

import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";

const generalAITools = [
  { name: "ChatGPT", description: "OpenAI's most popular conversational AI.", category: "General AI", link: "https://chat.openai.com", rating: 4.7, color: "bg-green-600" },
  { name: "Claude", description: "Anthropic's advanced and thoughtful AI assistant.", category: "General AI", link: "https://claude.ai", rating: 4.8, color: "bg-orange-600" },
  { name: "Gemini", description: "Google's powerful multimodal AI model.", category: "General AI", link: "https://gemini.google.com", rating: 4.6, color: "bg-blue-600" },
  { name: "Perplexity AI", description: "AI search engine with accurate citations.", category: "General AI", link: "https://perplexity.ai", rating: 4.7, color: "bg-purple-600" },
  { name: "Microsoft Copilot", description: "AI assistant integrated across Microsoft ecosystem.", category: "General AI", link: "https://copilot.microsoft.com", rating: 4.5, color: "bg-cyan-600" },
  { name: "Jasper AI", description: "AI writing assistant for marketing and content creation.", category: "Writing", link: "https://jasper.ai", rating: 4.4, color: "bg-pink-600" },
  { name: "Copy.ai", description: "Fast AI copywriting and content generation tool.", category: "Writing", link: "https://copy.ai", rating: 4.3, color: "bg-rose-600" },
  { name: "Rytr", description: "Affordable AI writing assistant.", category: "Writing", link: "https://rytr.me", rating: 4.2, color: "bg-amber-600" },
  { name: "Writesonic", description: "AI writer with SEO and marketing features.", category: "Writing", link: "https://writesonic.com", rating: 4.4, color: "bg-emerald-600" },
  { name: "Grammarly", description: "AI-powered writing and grammar checker.", category: "Writing", link: "https://grammarly.com", rating: 4.6, color: "bg-indigo-600" },
  { name: "Midjourney", description: "Leading AI image generation tool.", category: "Image Generation", link: "https://midjourney.com", rating: 4.8, color: "bg-violet-600" },
  { name: "DALL·E 3", description: "OpenAI's advanced image generation model.", category: "Image Generation", link: "https://chat.openai.com", rating: 4.7, color: "bg-sky-600" },
  { name: "Canva Magic Studio", description: "AI design tools inside Canva.", category: "Design", link: "https://canva.com", rating: 4.5, color: "bg-fuchsia-600" },
  { name: "Adobe Firefly", description: "Adobe's family of generative AI tools.", category: "Design", link: "https://firefly.adobe.com", rating: 4.6, color: "bg-red-600" },
  { name: "Leonardo.ai", description: "Powerful AI art and image generation platform.", category: "Image Generation", link: "https://leonardo.ai", rating: 4.7, color: "bg-lime-600" },
  { name: "Synthesia", description: "AI video generation with realistic avatars.", category: "Video", link: "https://synthesia.io", rating: 4.5, color: "bg-teal-600" },
  { name: "Runway", description: "Advanced AI video and image generation.", category: "Video", link: "https://runwayml.com", rating: 4.6, color: "bg-cyan-600" },
  { name: "ElevenLabs", description: "Ultra-realistic AI voice synthesis.", category: "Audio", link: "https://elevenlabs.io", rating: 4.9, color: "bg-rose-600" },
  { name: "Descript", description: "AI-powered audio and video editing.", category: "Audio", link: "https://descript.com", rating: 4.5, color: "bg-amber-600" },
  { name: "Otter.ai", description: "AI meeting notes and transcription.", category: "Productivity", link: "https://otter.ai", rating: 4.4, color: "bg-yellow-600" },
  { name: "Gamma", description: "AI-powered presentation maker.", category: "Productivity", link: "https://gamma.app", rating: 4.5, color: "bg-sky-600" },
  { name: "Notion AI", description: "AI features built into Notion.", category: "Productivity", link: "https://notion.so", rating: 4.5, color: "bg-zinc-600" },
  { name: "Zapier Central", description: "AI automation and agent builder.", category: "Automation", link: "https://zapier.com", rating: 4.4, color: "bg-emerald-600" },
  { name: "Framer AI", description: "AI website and design generation in Framer.", category: "Design", link: "https://framer.com", rating: 4.6, color: "bg-fuchsia-600" },
];

const codeGenerators = [
  { name: "GitHub Copilot", description: "The most popular AI coding assistant.", category: "Code Generator", link: "https://github.com/features/copilot", rating: 4.7, color: "bg-purple-600" },
  { name: "Cursor", description: "AI-first code editor that feels like pair programming with a genius.", category: "Code Generator", link: "https://cursor.com/?ref=codeomniverse", rating: 4.9, color: "bg-blue-600" },
  { name: "Replit Agent", description: "AI agent that builds apps inside Replit.", category: "Code Generator", link: "https://replit.com/ai", rating: 4.5, color: "bg-cyan-600" },
  { name: "Bolt.new", description: "Instant full-stack app builder with AI.", category: "Code Generator", link: "https://bolt.new", rating: 4.6, color: "bg-green-600" },
  { name: "v0 by Vercel", description: "Generate beautiful UI components from text.", category: "Code Generator", link: "https://v0.dev", rating: 4.7, color: "bg-pink-600" },
  { name: "Tabnine", description: "AI code completion for all major IDEs.", category: "Code Generator", link: "https://tabnine.com", rating: 4.4, color: "bg-indigo-600" },
  { name: "Codeium", description: "Fast and powerful AI coding assistant.", category: "Code Generator", link: "https://codeium.com", rating: 4.5, color: "bg-emerald-600" },
  { name: "Amazon CodeWhisperer", description: "AWS AI coding companion.", category: "Code Generator", link: "https://aws.amazon.com/codewhisperer", rating: 4.3, color: "bg-yellow-600" },
  { name: "Blackbox AI", description: "Fast AI coding assistant with code search.", category: "Code Generator", link: "https://blackbox.ai", rating: 4.4, color: "bg-zinc-600" },
];

const allTools = [...generalAITools, ...codeGenerators];

const categories = ["All", "Code Generator", "General AI", "Writing", "Image Generation", "Video", "Audio", "Productivity", "Automation", "Design"];

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
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
            <h1 className="text-2xl font-semibold">CodeOmniverse</h1>
          </div>
          <p className="text-sm text-zinc-400">AI Tools Hub</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-semibold tracking-tight mb-3">CodeOmniverse</h2>
          <p className="text-xl text-zinc-400">Discover the best AI tools for coding and general use</p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative mb-8">
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

        {/* AI Code Generators Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-semibold mb-10 text-center">🔥 AI Code Generators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeGenerators.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-4xl font-bold text-white`}>{tool.name[0]}</div>
                <h4 className="text-2xl font-semibold mb-3">{tool.name}</h4>
                <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-100">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* General AI Tools Section */}
        <div>
          <h3 className="text-3xl font-semibold mb-10 text-center">🌐 General AI Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalAITools.filter(t => activeCategory === "All" || t.category === activeCategory).map((tool, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-4xl font-bold text-white`}>{tool.name[0]}</div>
                <h4 className="text-2xl font-semibold mb-3">{tool.name}</h4>
                <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white text-black font-semibold py-3.5 rounded-2xl hover:bg-zinc-100">
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-800 bg-black py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          CodeOmniverse © 2026 • Curated for developers
        </div>
      </footer>
    </div>
  );
}