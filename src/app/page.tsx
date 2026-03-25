"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ExternalLink, ChevronDown, Info, Code, Video, Mic, Scissors, Zap, Copy } from "lucide-react";
import Editor from "@monaco-editor/react";

const categories = [ /* your categories remain the same */ ];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "video" | "audio" | "editing" | "builder">("code");

  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoverExplanation, setHoverExplanation] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<any>(null);

  // Particle Background (unchanged)
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
      particles.forEach(p => p.update(mouseX, mouseY, canvas.width, canvas.height) || p.draw(ctx));
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedCode("");
    setHoverExplanation("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language: selectedLang }),
      });

      const data = await res.json();
      setGeneratedCode(data.code || "// No code returned");
    } catch (error) {
      setGeneratedCode("// Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      alert("Code copied!");
    }
  };

  // Hover explanation feature
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.onMouseMove((e: any) => {
      const position = e.target.position;
      if (!position || !generatedCode) return;

      const lineNumber = position.lineNumber;
      const lines = generatedCode.split("\n");
      const lineContent = lines[lineNumber - 1];

      if (lineContent && lineContent.trim()) {
        // Simple simulation for now - later we can make real AI call
        setHoverExplanation(`Line ${lineNumber}: ${lineContent.trim()}`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Sidebar and Tabs remain same as before */}

      <main className="flex-1 pt-20 relative z-10 p-10">
        {activeTab === "code" && (
          <div className="max-w-6xl mx-auto">
            {/* Prompt Bar - same as before */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 mb-8">
              <div className="flex gap-4 mb-6">
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm">
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
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500"
                />

                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 px-8 py-4 rounded-2xl font-medium"
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
                  height="650px"
                  language={selectedLang === "html" ? "html" : selectedLang}
                  value={generatedCode}
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                  }}
                />
              </div>
            )}

            {/* Hover Explanation Box */}
            {hoverExplanation && (
              <div className="mt-4 bg-zinc-900 border border-violet-500/30 rounded-2xl p-5 text-sm text-zinc-300">
                <strong className="text-violet-400">Line Explanation:</strong> {hoverExplanation}
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== "code" && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-4xl font-bold mb-4">Coming Soon</h2>
            <p className="text-xl text-zinc-400">Video Studio and other features will be added next.</p>
          </div>
        )}
      </main>
    </div>
  );
}