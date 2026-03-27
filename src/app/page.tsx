"use client";

import { useState, useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Background
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

  // Example Prompts
  const examplePrompts = [
    "React todo app with dark mode and local storage",
    "Python script to analyze CSV sales data",
    "Tailwind dashboard layout with sidebar",
    "Node.js API endpoint for user login",
    "Simple Snake game in JavaScript",
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <main className="relative z-10 min-h-screen pt-16 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                C
              </div>
            </div>
            <h1 className="text-7xl font-bold tracking-tighter mb-4">CodeOmniverse</h1>
            <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
              Describe what you want to build.<br />Get clean, working code instantly.
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 mb-12">
            <div className="flex gap-4 mb-8">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500"
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
                placeholder="Describe what you want to build..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-8 py-4 text-xl focus:outline-none focus:border-violet-500"
              />

              <button
                onClick={handleGenerateCode}
                disabled={isGenerating || !prompt.trim()}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 px-10 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 transition min-w-[180px] justify-center"
              >
                {isGenerating ? "Generating..." : "Generate Code"}
              </button>
            </div>

            {/* Example Prompts */}
            <div className="flex flex-wrap gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-2xl transition text-zinc-300 hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Code */}
          {generatedCode && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <span className="font-medium text-lg">Generated {selectedLang} Code</span>
                <button 
                  onClick={copyCode} 
                  className="flex items-center gap-2 text-zinc-400 hover:text-white px-5 py-2 rounded-xl hover:bg-zinc-800 transition"
                >
                  <Copy size={20} /> Copy Code
                </button>
              </div>
              <Editor
                height="740px"
                language={selectedLang === "html" ? "html" : selectedLang}
                value={generatedCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  wordWrap: "on",
                  lineNumbers: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}