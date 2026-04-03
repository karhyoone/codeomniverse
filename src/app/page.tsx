"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, User, X } from "lucide-react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Navigation
  const [currentView, setCurrentView] = useState<"home" | "contact" | "privacy" | "terms">("home");

  // Auth
  const [showAuth, setShowAuth] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<{ email: string; username: string; password: string; history: Array<{ id: number; prompt: string; language: string; code: string; timestamp: string }> } | null>(null);

  // History
  const [history, setHistory] = useState<Array<{ id: number; prompt: string; language: string; code: string; timestamp: string }>>([]);

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

  // Load saved user on mount
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUsername(user.username);
      setHistory(user.history || []);
    }
  }, []);

  const saveUser = (user: any) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

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

      const newCode = code || "// No code was generated.";
      setGeneratedCode(newCode);

      // Save to history if logged in
      if (isLoggedIn && currentUser) {
        const newEntry = {
          id: Date.now(),
          prompt,
          language: selectedLang,
          code: newCode,
          timestamp: new Date().toISOString()
        };
        const updatedHistory = [newEntry, ...history];
        setHistory(updatedHistory);

        const updatedUser = { ...(currentUser as any), history: updatedHistory };
        setCurrentUser(updatedUser);
        saveUser(updatedUser);
      }
    } catch (error: any) {
      setGeneratedCode(`// Error: ${error.message}`);
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

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }
    const newUser = {
      email,
      username: email.split('@')[0],
      password,
      history: []
    };
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setUsername(newUser.username);
    setHistory([]);
    setShowAuth(false);
    setEmail("");
    setPassword("");
    alert("Account created successfully!");
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const saved = localStorage.getItem("currentUser");
    if (!saved) {
      alert("No account found. Please sign up first.");
      return;
    }
    const user = JSON.parse(saved);
    if (user.email === email && user.password === password) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUsername(user.username);
      setHistory(user.history || []);
      setShowAuth(false);
      setEmail("");
      setPassword("");
      alert("Login successful!");
    } else {
      alert("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername("");
    setHistory([]);
    localStorage.removeItem("currentUser");
  };

  const examplePrompts = [
    "React todo app with dark mode and local storage",
    "Python script to analyze CSV sales data",
    "Tailwind dashboard layout with sidebar",
    "Node.js API for user authentication",
    "Simple Snake game in JavaScript",
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <main className="relative z-10 min-h-screen pt-16 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-8 text-sm">
              <button onClick={() => setCurrentView("home")} className={`hover:text-violet-400 transition ${currentView === "home" ? "text-white font-medium" : "text-zinc-400"}`}>Home</button>
              <button onClick={() => setCurrentView("contact")} className={`hover:text-violet-400 transition ${currentView === "contact" ? "text-white font-medium" : "text-zinc-400"}`}>Contact</button>
              <button onClick={() => setCurrentView("privacy")} className={`hover:text-violet-400 transition ${currentView === "privacy" ? "text-white font-medium" : "text-zinc-400"}`}>Privacy</button>
              <button onClick={() => setCurrentView("terms")} className={`hover:text-violet-400 transition ${currentView === "terms" ? "text-white font-medium" : "text-zinc-400"}`}>Terms</button>
            </div>

            <div>
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">Hi, {username}</span>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-2xl text-sm transition"
                >
                  <User size={18} /> Login / Signup
                </button>
              )}
            </div>
          </div>

          {/* HOME */}
          {currentView === "home" && (
            <>
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                    C
                  </div>
                </div>
                <h1 className="text-7xl font-bold tracking-tighter mb-4">CodeOmniverse</h1>
                <p className="text-2xl text-zinc-400">Describe your idea. Get clean, working code instantly.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 mb-16">
                <div className="flex gap-4 mb-8">
                  <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500">
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
                    {examplePrompts.map((ex, i) => (
                      <button key={i} onClick={() => setPrompt(ex)} className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-2xl transition text-zinc-300 hover:text-white">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                    options={{ minimap: { enabled: false }, fontSize: 16, wordWrap: "on", lineNumbers: "on", automaticLayout: true }}
                  />
                </div>
              )}

              {/* How It Works */}
              <div className="mb-20">
                <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                    <div className="text-5xl mb-4">1️⃣</div>
                    <h3 className="text-2xl font-semibold mb-3">Describe</h3>
                    <p className="text-zinc-400">Type your idea in plain English.</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                    <div className="text-5xl mb-4">2️⃣</div>
                    <h3 className="text-2xl font-semibold mb-3">Choose Language</h3>
                    <p className="text-zinc-400">Pick your preferred language.</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center">
                    <div className="text-5xl mb-4">3️⃣</div>
                    <h3 className="text-2xl font-semibold mb-3">Get Code</h3>
                    <p className="text-zinc-400">Receive clean, ready-to-use code.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contact */}
          {currentView === "contact" && (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
              <p className="text-zinc-400 mb-10">Have questions? Reach out anytime.</p>
              <a href="mailto:karhyoone@gmail.com" className="text-2xl text-violet-400 hover:text-violet-300">
                karhyoone@gmail.com
              </a>
            </div>
          )}

          {/* Privacy */}
          {currentView === "privacy" && (
            <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 prose prose-invert">
              <h2 className="text-4xl font-bold mb-8">Privacy Policy</h2>
              <p>Last updated: April 2026</p>
              <h3>Information We Collect</h3>
              <p>We collect prompts and generated code to provide the service. No personal data is collected unless you contact us.</p>
              <h3>Data Usage</h3>
              <p>Your prompts are used only for generation and service improvement. We do not sell your data.</p>
            </div>
          )}

          {/* Terms */}
          {currentView === "terms" && (
            <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 prose prose-invert">
              <h2 className="text-4xl font-bold mb-8">Terms of Service</h2>
              <p>Last updated: April 2026</p>
              <h3>1. Acceptance</h3>
              <p>By using CodeOmniverse you agree to these terms.</p>
              <h3>2. Service</h3>
              <p>The service is provided "as is". We are not liable for any issues with generated code.</p>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-10 relative">
            <button onClick={() => setShowAuth(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-violet-600 rounded-2xl flex items-center justify-center mb-4">
                <User size={32} />
              </div>
              <h2 className="text-3xl font-bold">{isLoginMode ? "Login" : "Sign Up"}</h2>
            </div>

            <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium text-lg transition">
                {isLoginMode ? "Login" : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-6">
              <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-violet-400 hover:text-violet-300">
                {isLoginMode ? "Need an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}