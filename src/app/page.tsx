"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ExternalLink, ChevronDown, Info, Code, Video, Mic, Scissors, Zap, Copy, BookOpen, PlayCircle, List, Image, Users } from "lucide-react";
import Editor from "@monaco-editor/react";

const categories = [
  {
    name: "AI Code & Dev Tools (2026)",
    tools: [
      { name: "Claude Code", link: "https://claude.ai", desc: "Best agentic coding 2026" },
      { name: "Cursor", link: "https://cursor.com", desc: "AI-first IDE" },
      { name: "GitHub Copilot", link: "https://github.com/features/copilot", desc: "VS Code powerhouse" },
      { name: "Grok 4", link: "https://grok.x.ai", desc: "xAI coding beast" },
      { name: "Codex", link: "https://openai.com", desc: "OpenAI code agent" },
      { name: "Windsurf", link: "https://windsurf.ai", desc: "Next-gen coding" },
    ],
  },
  {
    name: "Video Generation & Editing",
    tools: [
      { name: "Google Veo 3.1", link: "https://google.com/veo", desc: "Best overall text-to-video" },
      { name: "Runway Gen-4.5", link: "https://runwayml.com", desc: "Cinematic control" },
      { name: "OpenAI Sora 2", link: "https://openai.com/sora", desc: "Storytelling videos" },
      { name: "Kling 3", link: "https://kling.ai", desc: "High-action realism" },
      { name: "HeyGen", link: "https://heygen.com", desc: "AI avatars & talking heads" },
      { name: "Vizard.ai", link: "https://vizard.ai", desc: "Long-to-short editing" },
    ],
  },
  {
    name: "Audio & Voice Tools",
    tools: [
      { name: "ElevenLabs", link: "https://elevenlabs.io", desc: "Most realistic voice 2026" },
      { name: "Murf AI", link: "https://murf.ai", desc: "Studio voiceovers" },
      { name: "Play.ht", link: "https://play.ht", desc: "Multilingual TTS" },
      { name: "WellSaid Labs", link: "https://wellsaid.com", desc: "Enterprise voices" },
      { name: "Resemble AI", link: "https://resemble.ai", desc: "Voice cloning" },
    ],
  },
  {
    name: "Text-to-Media & Assistants",
    tools: [
      { name: "Fliki", link: "https://fliki.ai", desc: "Text → video + voice" },
      { name: "Synthesia", link: "https://synthesia.io", desc: "Avatar videos" },
      { name: "Pictory", link: "https://pictory.ai", desc: "Blog → video" },
      { name: "CapCut AI", link: "https://capcut.com", desc: "Free editing + AI" },
    ],
  },
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "video" | "audio" | "editing" | "builder">("code");

  // Added for multi-page support
  const [currentPage, setCurrentPage] = useState<"playground" | "howitworks" | "tutorials" | "features" | "examples" | "about">("playground");

  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Background (your original code - untouched)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const colors = ["#3b82f6", "#ec4899", "#f59e0b", "#a855f7", "#ffffff"];
    const particles: any[] = [];

    class ParticleClass {
      x: number; y: number; size: number; speedX: number; speedY: number; color: string;
      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX; this.y += this.speedY;
        const dx = mouseX - this.x, dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) { this.speedX += dx / 15000; this.speedY += dy / 15000; }
        if (this.x < 0) this.x = canvasWidth; if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight; if (this.y > canvasHeight) this.y = 0;
      }
      draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = 0.65;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    for (let i = 0; i < 130; i++) {
      particles.push(new ParticleClass(canvas.width, canvas.height));
    }

    let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
    const handleMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(mouseX, mouseY, canvas.width, canvas.height);
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Improved Generate Code with stronger Markdown cleaning
  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedCode("Generating...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language: selectedLang }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      let code = data.code || "";

      code = code
        .replace(/```[\w]*\n?/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^```.*\n?/gm, '')
        .trim();

      setGeneratedCode(code || "// No code was generated.");
    } catch (error: any) {
      console.error("Generation error:", error);
      setGeneratedCode(`// Error: ${error.message || "Failed to generate code. Please check your GROK_API_KEY in Vercel."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      alert("Code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Sidebar - Your original code (untouched) */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-xl flex flex-col h-screen overflow-y-auto z-10">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
            <h1 className="text-3xl font-bold tracking-tighter">CodeOmniverse</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search any AI tool..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {categories.map(cat => (
            <div key={cat.name}>
              <button 
                onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-zinc-900 rounded-2xl text-left font-medium"
              >
                {cat.name}
                <ChevronDown size={18} className={`transition ${openCategory === cat.name ? "rotate-180" : ""}`} />
              </button>
              {openCategory === cat.name && (
                <div className="pl-6 mt-1 space-y-1">
                  {cat.tools.map(tool => (
                    <a key={tool.name} href={tool.link} target="_blank" rel="noopener noreferrer"
                      className="block py-2.5 px-4 text-sm text-zinc-300 hover:text-violet-400 hover:bg-zinc-900 rounded-2xl transition flex justify-between items-center">
                      {tool.name}
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-zinc-800 mt-auto">
          <button 
            onMouseEnter={() => setShowAbout(true)} 
            onMouseLeave={() => setShowAbout(false)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white w-full px-4 py-3 hover:bg-zinc-900 rounded-2xl"
          >
            <Info size={18} /> About CodeOmniverse
          </button>
        </div>
      </aside>

      {/* Added: Top Navigation Bar for 6 Pages */}
      <div className="absolute top-6 left-80 right-0 z-30 flex gap-2 px-8 bg-black/80 backdrop-blur-md py-3 border-b border-zinc-800">
        <button onClick={() => setCurrentPage("playground")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "playground" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <Code size={18} /> Code Playground
        </button>
        <button onClick={() => setCurrentPage("howitworks")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "howitworks" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <BookOpen size={18} /> How It Works
        </button>
        <button onClick={() => setCurrentPage("tutorials")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "tutorials" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <PlayCircle size={18} /> Video Tutorials
        </button>
        <button onClick={() => setCurrentPage("features")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "features" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <List size={18} /> Features
        </button>
        <button onClick={() => setCurrentPage("examples")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "examples" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <Image size={18} /> Examples & Slides
        </button>
        <button onClick={() => setCurrentPage("about")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition ${currentPage === "about" ? "bg-white text-black" : "hover:bg-zinc-900"}`}>
          <Users size={18} /> About
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-28 relative z-10 p-10">

        {/* Your Original Code Playground - completely untouched */}
        {currentPage === "playground" && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 mb-8">
              <div className="flex gap-4 mb-6">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="html">HTML/CSS</option>
                </select>

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build... (e.g. React todo app with dark mode)"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500"
                />

                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 px-8 py-4 rounded-2xl font-medium flex items-center gap-2 transition"
                >
                  {isGenerating ? "Generating..." : "Generate Code"}
                </button>
              </div>
            </div>

            {generatedCode && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                  <span className="font-medium">Generated {selectedLang} Code</span>
                  <button onClick={copyCode} className="flex items-center gap-2 text-zinc-400 hover:text-white">
                    <Copy size={18} /> Copy
                  </button>
                </div>
                <Editor
                  height="680px"
                  language={selectedLang === "html" ? "html" : selectedLang}
                  value={generatedCode}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    wordWrap: "on",
                    lineNumbers: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* New Pages - Added only, nothing from your original code was removed */}
        {currentPage === "howitworks" && (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">How CodeOmniverse Works</h2>
            <div className="bg-zinc-900 rounded-3xl p-8 mb-8">
              <video controls className="w-full rounded-2xl" src="https://www.w3schools.com/html/mov_bbb.mp4">
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-xl text-zinc-400">Watch how your prompt turns into working code step by step.</p>
          </div>
        )}

        {currentPage === "tutorials" && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 rounded-3xl p-6">
                <video controls className="w-full rounded-2xl" src="https://www.w3schools.com/html/mov_bbb.mp4" />
                <p className="mt-4 text-center">How to generate your first React app</p>
              </div>
              <div className="bg-zinc-900 rounded-3xl p-6">
                <video controls className="w-full rounded-2xl" src="https://www.w3schools.com/html/mov_bbb.mp4" />
                <p className="mt-4 text-center">Creating a Python Trading Bot with AI</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === "features" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">Powerful Features</h2>
            <p className="text-xl text-zinc-400">Everything you need to build faster with AI in one place.</p>
          </div>
        )}

        {currentPage === "examples" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">Examples & Slides</h2>
            <p className="text-xl text-zinc-400">Real examples and interactive slides showing what you can build.</p>
          </div>
        )}

        {currentPage === "about" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">About CodeOmniverse</h2>
            <p className="text-xl text-zinc-400">The ultimate AI hub where developers generate code, videos, audio, and more — all in one place.</p>
          </div>
        )}
      </main>
    </div>
  );
}