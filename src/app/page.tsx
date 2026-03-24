"use client";

import { useState } from "react";
import { Search, ExternalLink, ArrowRight } from "lucide-react";

const tools = [
  { name: "Grok 4", category: "Code Generator", link: "https://grok.x.ai", description: "xAI's powerful and truthful AI for coding" },
  { name: "Cursor", category: "Code Generator", link: "https://cursor.com", description: "AI-first code editor" },
  { name: "GitHub Copilot", category: "Code Generator", link: "https://github.com/features/copilot", description: "AI pair programmer" },
  { name: "Claude", category: "Code Generator", link: "https://claude.ai", description: "Excellent for complex coding" },
  { name: "v0 by Vercel", category: "UI Generation", link: "https://v0.dev", description: "AI UI generator" },
  { name: "Bolt.new", category: "App Builder", link: "https://bolt.new", description: "Instant full-stack app builder" },
  { name: "ChatGPT", category: "General AI", link: "https://chat.openai.com", description: "Popular conversational AI" },
  { name: "Midjourney", category: "Image Generation", link: "https://midjourney.com", description: "Best AI image generator" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl">C</div>
            <span className="text-2xl font-semibold">CodeOmniverse</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#tools" className="hover:text-blue-400 transition">Tools</a>
            <a href="#about" className="hover:text-blue-400 transition">About</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-24 text-center px-6">
        <h1 className="text-7xl font-bold tracking-tighter mb-6">
          The Home for<br />AI Development Tools
        </h1>
        <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
          We curate the most powerful AI tools so developers can build faster, smarter, and better.
        </p>
      </div>

      {/* Tools Section */}
      <div id="tools" className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-semibold text-center mb-12">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, i) => (
            <div key={i} className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                  {tool.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{tool.name}</h3>
                  <p className="text-sm text-zinc-500">{tool.category}</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-8 line-clamp-3">{tool.description}</p>
              <a href={tool.link} target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
                Visit Tool <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section - Strong & Professional */}
      <div id="about" className="bg-zinc-900 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-8">About CodeOmniverse</h2>
          
          <div className="prose prose-invert max-w-3xl mx-auto text-lg leading-relaxed text-zinc-300">
            <p>
              CodeOmniverse was created for developers who refuse to waste time searching through scattered tools and hype.
            </p>
            <p>
              We cut through the noise and curate only the most powerful, reliable, and impactful AI tools — whether you're writing code, designing interfaces, generating content, or building entire products.
            </p>
            <p>
              Our mission is simple: <strong>Help developers move faster, build better, and stay ahead</strong> in the rapidly evolving world of AI.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <div className="text-blue-400 text-4xl mb-4">🔍</div>
              <h4 className="font-semibold text-xl mb-3">Curated Excellence</h4>
              <p className="text-zinc-400">We test and review every tool before adding it. Only the best make the cut.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <div className="text-blue-400 text-4xl mb-4">⚡</div>
              <h4 className="font-semibold text-xl mb-3">Built for Speed</h4>
              <p className="text-zinc-400">We focus on tools that genuinely save time and boost productivity.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <div className="text-blue-400 text-4xl mb-4">🌍</div>
              <h4 className="font-semibold text-xl mb-3">For Real Developers</h4>
              <p className="text-zinc-400">Made by developers, for developers who ship products, not just experiment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          CodeOmniverse © 2026 • Curated with passion for the developer community
        </div>
      </footer>
    </div>
  );
}