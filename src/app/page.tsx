"use client";

import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";

const tools = [
  {
    name: "Cursor",
    description: "The AI-first code editor that feels like pair programming with a genius.",
    category: "Code Editor",
    link: "https://cursor.com",
    rating: 4.9,
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that writes code for you in real time.",
    category: "Coding Assistant",
    link: "https://github.com/features/copilot",
    rating: 4.7,
  },
  {
    name: "Replit AI",
    description: "AI coding assistant built into the Replit online IDE.",
    category: "Coding Assistant",
    link: "https://replit.com/ai",
    rating: 4.5,
  },
  {
    name: "Claude Projects",
    description: "Powerful AI coding agent from Anthropic with long context.",
    category: "Coding Assistant",
    link: "https://claude.ai",
    rating: 4.8,
  },
  {
    name: "v0 by Vercel",
    description: "AI-powered UI generator that turns text into beautiful React components.",
    category: "UI/Design",
    link: "https://v0.dev",
    rating: 4.6,
  },
  {
    name: "Bolt.new",
    description: "AI-powered full-stack app builder in your browser.",
    category: "App Builder",
    link: "https://bolt.new",
    rating: 4.4,
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">CodeOmniverse</h1>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
            The ultimate directory of AI tools for developers
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search AI tools for developers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-blue-500 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                    {tool.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">{tool.name}</h3>
                    <p className="text-sm text-zinc-500">{tool.category}</p>
                  </div>
                </div>
                <div className="flex items-center text-amber-400 text-sm">
                  ★ {tool.rating}
                </div>
              </div>

              <p className="text-zinc-400 mb-6 line-clamp-3">
                {tool.description}
              </p>

              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                Visit Tool 
                <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 text-zinc-500">
          More AI tools being added weekly. Suggest a tool?
        </div>
      </div>
    </div>
  );
}