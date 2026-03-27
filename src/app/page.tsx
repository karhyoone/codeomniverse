"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Info, Code, Copy } from "lucide-react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbout, setShowAbout] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Background (your original - untouched)
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

  // Code Generation
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

      {/* Minimal Sidebar - No categories, no links */}
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
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 p-6">
          {/* Empty space - no categories or links */}
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

      {/* Main Content - Only Code Generation */}
      <main className="flex-1 pt-20 relative z-10 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold tracking-tighter mb-4">CodeOmniverse</h1>
            <p className="text-2xl text-zinc-400">Generate clean, working code instantly</p>
          </div>

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
      </main>
    </div>
  );
}