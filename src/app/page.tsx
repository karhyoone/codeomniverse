"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";

const tools = [
  // General AI Tools
  { name: "ChatGPT", category: "General AI", link: "https://chat.openai.com", description: "OpenAI's popular conversational AI" },
  { name: "Claude", category: "General AI", link: "https://claude.ai", description: "Powerful AI from Anthropic" },
  { name: "Gemini", category: "General AI", link: "https://gemini.google.com", description: "Google's advanced AI" },
  { name: "Perplexity AI", category: "General AI", link: "https://perplexity.ai", description: "AI search engine with citations" },
  { name: "Jasper AI", category: "Writing", link: "https://jasper.ai", description: "AI writing assistant for marketing" },
  { name: "Midjourney", category: "Image Generation", link: "https://midjourney.com", description: "Best AI image generator" },
  { name: "ElevenLabs", category: "Audio", link: "https://elevenlabs.io", description: "Ultra-realistic AI voice" },
  { name: "Notion AI", category: "Productivity", link: "https://notion.so", description: "AI inside Notion" },

  // AI Code Generators
  { name: "Cursor", category: "Code Generator", link: "https://cursor.com/?ref=codeomniverse", description: "AI-first code editor" },
  { name: "GitHub Copilot", category: "Code Generator", link: "https://github.com/features/copilot", description: "AI pair programmer" },
  { name: "Claude Code", category: "Code Generator", link: "https://claude.ai", description: "Claude for coding" },
  { name: "v0 by Vercel", category: "Code Generator", link: "https://v0.dev", description: "AI UI generator" },
  { name: "Bolt.new", category: "Code Generator", link: "https://bolt.new", description: "Instant app builder" },
  { name: "Replit Agent", category: "Code Generator", link: "https://replit.com/ai", description: "AI agent in Replit" },
  { name: "Codeium", category: "Code Generator", link: "https://codeium.com", description: "Fast AI coding assistant" },
  { name: "Tabnine", category: "Code Generator", link: "https://tabnine.com", description: "AI code completion" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">CodeOmniverse</h1>
          <p className="text-xl text-zinc-400">Discover the best AI tools for developers and creators</p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold">{tool.name}</h3>
                <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{tool.category}</span>
              </div>
              <p className="text-zinc-400 mb-6 line-clamp-3">{tool.description}</p>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition"
              >
                Visit Tool →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}