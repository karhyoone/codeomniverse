"use client";

import { useState, useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import Editor from "@monaco-editor/react";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Blog state
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Background (untouched)
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
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      let code = data.code || "";
      code = code
        .replace(/```[\w]*\n?/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^```.*\n?/gm, '')
        .trim();
      setGeneratedCode(code || "// No code was generated.");
    } catch (error: any) {
      setGeneratedCode(`// Error: ${error.message}`);
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

  const examplePrompts = [
    "React todo app with dark mode and local storage",
    "Python script to analyze CSV sales data",
    "Tailwind dashboard layout with sidebar",
    "Node.js API for user authentication",
    "Simple Snake game in JavaScript",
  ];

  // Expanded Blog Posts
  const blogPosts = [
    {
      id: 1,
      title: "How to Build a React Todo App with AI in Under 5 Minutes",
      date: "March 2026",
      excerpt: "Learn how CodeOmniverse can generate a complete todo app with dark mode and persistence.",
      content: `
        <h3>Why Use AI for Todo Apps?</h3>
        <p>Building a todo app is a classic beginner project, but it still takes time to set up state management, local storage, and UI. With CodeOmniverse, you can generate the entire app in seconds.</p>
        
        <h3>Step-by-Step</h3>
        <p>1. Type: "React todo app with dark mode and local storage"</p>
        <p>2. Choose JavaScript or TypeScript</p>
        <p>3. Get a complete functional component with useState, useEffect, and persistence.</p>
        
        <p>The generated code includes add, delete, toggle, and clear completed features — all ready to copy and run.</p>
        
        <p>This approach saves hours and helps you learn modern React patterns faster.</p>
      `
    },
    {
      id: 2,
      title: "Best AI Coding Tools Comparison 2026",
      date: "March 2026",
      excerpt: "We tested Grok, Claude, Cursor, and more. See which one actually saves developers the most time.",
      content: `
        <p>In 2026, AI coding assistants have become essential. But which one is truly the best?</p>
        
        <h3>Our Testing Criteria</h3>
        <p>We evaluated speed, code quality, ease of use, and real-world productivity.</p>
        
        <p><strong>Grok 4</strong> excelled in complex logic and creative solutions.</p>
        <p><strong>Claude</strong> was best for clean, well-documented code.</p>
        <p><strong>Cursor</strong> won for IDE integration.</p>
        
        <p>CodeOmniverse stands out by focusing purely on fast, clean code generation without distractions.</p>
      `
    },
    {
      id: 3,
      title: "Python Automation Scripts You Can Generate Instantly",
      date: "February 2026",
      excerpt: "From data analysis to web scraping — real examples generated by CodeOmniverse.",
      content: `
        <p>Python is perfect for automation, but writing scripts from scratch takes time.</p>
        
        <p>With CodeOmniverse, you can generate scripts for:</p>
        <ul>
          <li>CSV data analysis with pandas and matplotlib</li>
          <li>Web scraping with BeautifulSoup</li>
          <li>File organization and renaming</li>
          <li>Daily report generation</li>
        </ul>
        
        <p>Just describe the task and get ready-to-run code with error handling included.</p>
      `
    },
    {
      id: 4,
      title: "Prompt Engineering Tips for Better Code Generation",
      date: "February 2026",
      excerpt: "How to write prompts that give you cleaner, more accurate code every time.",
      content: `
        <p>Good prompts = better code.</p>
        
        <h3>Pro Tips</h3>
        <ul>
          <li>Be specific about language and framework</li>
          <li>Mention desired features clearly</li>
          <li>Ask for comments and error handling</li>
          <li>Include "make it clean and modern"</li>
        </ul>
        
        <p>Example good prompt: "Create a React todo app with dark mode, local storage, and smooth animations using Tailwind."</p>
      `
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <main className="relative z-10 min-h-screen pt-16 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                C
              </div>
            </div>
            <h1 className="text-7xl font-bold tracking-tighter mb-4">CodeOmniverse</h1>
            <p className="text-2xl text-zinc-400">Describe your idea. Get clean, working code instantly.</p>
          </div>

          {/* Main Code Generator */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 mb-16">
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

            <div>
              <p className="text-zinc-400 mb-3 text-sm">Try these examples:</p>
              <div className="flex flex-wrap gap-3">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-2xl transition text-zinc-300 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code */}
          {generatedCode && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden mb-20">
              <div className="p-5 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <span className="font-medium text-lg">Generated {selectedLang} Code</span>
                <button onClick={copyCode} className="flex items-center gap-2 text-zinc-400 hover:text-white px-5 py-2 rounded-xl hover:bg-zinc-800">
                  <Copy size={20} /> Copy
                </button>
              </div>
              <Editor
                height="720px"
                language={selectedLang === "html" ? "html" : selectedLang}
                value={generatedCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  wordWrap: "on",
                  lineNumbers: "on",
                  automaticLayout: true,
                }}
              />
            </div>
          )}

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="text-2xl font-semibold mb-3">Describe Your Idea</h3>
                <p className="text-zinc-400">Type what you want to build in plain English.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="text-2xl font-semibold mb-3">Choose Language</h3>
                <p className="text-zinc-400">Select JavaScript, Python, Rust, or any other language.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="text-2xl font-semibold mb-3">Get Clean Code</h3>
                <p className="text-zinc-400">Receive ready-to-use, well-commented code instantly.</p>
              </div>
            </div>
          </div>

          {/* Blog / Articles Section - Expanded */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Latest Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => setSelectedBlog(post)}
                  className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 hover:border-violet-500 transition cursor-pointer"
                >
                  <div className="text-sm text-violet-400 mb-2">{post.date}</div>
                  <h3 className="text-2xl font-semibold mb-4 leading-tight">{post.title}</h3>
                  <p className="text-zinc-400 mb-6 line-clamp-3">{post.excerpt}</p>
                  <button className="text-violet-400 hover:text-violet-300 font-medium">Read Full Article →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Full Blog Post Modal */}
          {selectedBlog && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="float-right text-zinc-400 hover:text-white text-xl"
                >
                  ✕
                </button>
                <div className="text-sm text-violet-400 mb-4">{selectedBlog.date}</div>
                <h2 className="text-4xl font-bold mb-8">{selectedBlog.title}</h2>
                <div 
                  className="prose prose-invert max-w-none text-zinc-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="mt-10 bg-zinc-800 hover:bg-zinc-700 px-8 py-3 rounded-2xl"
                >
                  Close Article
                </button>
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">About CodeOmniverse</h2>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
              CodeOmniverse was created because we were tired of switching between scattered AI tools and fixing broken code snippets. 
              We built a simple, fast platform where you can describe your idea in plain English and instantly get clean, working code.
            </p>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto mt-6">
              Our goal is to help developers ship faster, learn better, and focus on building amazing products instead of struggling with syntax.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}