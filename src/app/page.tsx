"use client";

import { useState, useEffect, useRef } from "react";
import { createClient, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { Copy, User, X, Settings as SettingsIcon, Menu } from "lucide-react";
import Editor from "@monaco-editor/react";

// Lazy Supabase client
let supabaseInstance: any = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase URL and Anon Key are missing. Check Vercel Environment Variables.");
    }
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
};

interface HistoryEntry {
  id: number;
  prompt: string;
  language: string;
  code: string;
  timestamp: string;
}

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

  // Navigation
  const [currentView, setCurrentView] = useState<"home" | "contact" | "privacy" | "terms">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth
  const [showAuth, setShowAuth] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Blog
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [siteLanguage, setSiteLanguage] = useState("English");
  const [showWidgets, setShowWidgets] = useState({
    howItWorks: true,
    blog: true,
    examples: true,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Supabase Auth
  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUsername(session.user.email?.split('@')[0] || "User");
        setUserId(session.user.id);
        loadUserHistory(session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        setIsLoggedIn(true);
        setUsername(session.user.email?.split('@')[0] || "User");
        setUserId(session.user.id);
        loadUserHistory(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setUserId(null);
        setHistory([]);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadUserHistory = async (uid: string) => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (data) {
      setHistory(data.map((item: any) => ({
        id: item.id,
        prompt: item.prompt,
        language: item.language,
        code: item.code,
        timestamp: item.created_at
      })));
    }
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

      if (isLoggedIn && userId) {
        const supabase = getSupabase();
        await supabase.from('user_history').insert({
          user_id: userId,
          prompt,
          language: selectedLang,
          code: newCode
        });
        loadUserHistory(userId);
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
      alert("Code copied!");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email to confirm your account!");
      setShowAuth(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else setShowAuth(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  };

  const examplePrompts = [
    "React todo app with dark mode and local storage",
    "Python script to analyze CSV sales data",
    "Tailwind dashboard layout with sidebar",
    "Node.js API for user authentication",
    "Simple Snake game in JavaScript",
  ];

  const blogPosts: BlogPost[] = [
    { id: 1, title: "How to Build a React Todo App with AI in Under 5 Minutes", date: "March 2026", excerpt: "Learn how to use CodeOmniverse to generate a fully functional todo app with dark mode and persistence.", content: `<h3>Why Use AI for Todo Apps?</h3><p>Building a todo app is a classic beginner project. With CodeOmniverse, you can generate the entire app in seconds.</p>` },
    { id: 2, title: "Best AI Coding Tools Comparison 2026", date: "March 2026", excerpt: "We tested Grok, Claude, Cursor, and more.", content: `<p>In 2026, AI coding assistants are essential.</p>` },
    { id: 3, title: "Python Automation Scripts You Can Generate Instantly", date: "February 2026", excerpt: "From data analysis to web scraping.", content: `<p>Generate scripts for CSV analysis and more in seconds.</p>` },
    { id: 4, title: "Prompt Engineering Tips for Better Code Generation", date: "February 2026", excerpt: "How to write prompts that give you cleaner code.", content: `<p>Be specific about language and features.</p>` }
  ];

  // Apply theme
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-zinc-100 text-zinc-900"} relative overflow-hidden`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Auth Gate */}
      {!isLoggedIn ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 text-white font-bold text-6xl">
              C
            </div>
            <h1 className="text-4xl font-bold mb-3">Welcome to CodeOmniverse</h1>
            <p className="text-zinc-400 mb-10">Sign in or create an account to start generating code</p>

            <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-6">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg" 
                required 
              />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg" 
                required 
              />
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium text-lg transition">
                {isLoginMode ? "Sign In" : "Create Account"}
              </button>
            </form>

            <button 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              className="mt-6 text-violet-400 hover:text-violet-300 text-sm"
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      ) : (
        // Normal site content - now mobile friendly
        <main className="relative z-10 min-h-screen pt-16 pb-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Top Navigation - Mobile Friendly */}
            <div className="flex justify-between items-center mb-8 sm:mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                  C
                </div>
                <span className="text-xl font-semibold">CodeOmniverse</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-8 text-sm">
                <button onClick={() => setCurrentView("home")} className={`hover:text-violet-400 transition ${currentView === "home" ? "text-white font-medium" : "text-zinc-400"}`}>Home</button>
                <button onClick={() => setCurrentView("contact")} className={`hover:text-violet-400 transition ${currentView === "contact" ? "text-white font-medium" : "text-zinc-400"}`}>Contact</button>
                <button onClick={() => setCurrentView("privacy")} className={`hover:text-violet-400 transition ${currentView === "privacy" ? "text-white font-medium" : "text-zinc-400"}`}>Privacy</button>
                <button onClick={() => setCurrentView("terms")} className={`hover:text-violet-400 transition ${currentView === "terms" ? "text-white font-medium" : "text-zinc-400"}`}>Terms</button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-3 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                  <Menu size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 hidden sm:inline">Hi, {username}</span>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>

                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-3 hover:bg-zinc-800 rounded-2xl transition"
                  title="Settings"
                >
                  <SettingsIcon size={22} />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-8">
                <div className="flex flex-col gap-4 text-sm">
                  <button onClick={() => { setCurrentView("home"); setIsMobileMenuOpen(false); }} className="text-left py-2">Home</button>
                  <button onClick={() => { setCurrentView("contact"); setIsMobileMenuOpen(false); }} className="text-left py-2">Contact</button>
                  <button onClick={() => { setCurrentView("privacy"); setIsMobileMenuOpen(false); }} className="text-left py-2">Privacy</button>
                  <button onClick={() => { setCurrentView("terms"); setIsMobileMenuOpen(false); }} className="text-left py-2">Terms</button>
                </div>
              </div>
            )}

            {/* Home View */}
            {currentView === "home" && (
              <>
                <div className="text-center mb-12 sm:mb-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                      C
                    </div>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-4">CodeOmniverse</h1>
                  <p className="text-xl sm:text-2xl text-zinc-400 px-4">Describe your idea. Get clean, working code instantly.</p>
                </div>

                {/* Code Generator - Mobile friendly */}
                <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-10 mb-12">
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500 w-full sm:w-auto">
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
                      className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 px-8 py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 transition w-full sm:w-auto"
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </button>
                  </div>

                  {showWidgets.examples && (
                    <div>
                      <p className="text-zinc-400 mb-3 text-sm">Try these examples:</p>
                      <div className="flex flex-wrap gap-3">
                        {examplePrompts.map((example, i) => (
                          <button key={i} onClick={() => setPrompt(example)} className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-2xl transition text-zinc-300 hover:text-white">
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {generatedCode && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden mb-12">
                    <div className="p-5 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                      <span className="font-medium text-lg">Generated {selectedLang} Code</span>
                      <button onClick={copyCode} className="flex items-center gap-2 text-zinc-400 hover:text-white px-5 py-2 rounded-xl hover:bg-zinc-800">
                        <Copy size={20} /> Copy
                      </button>
                    </div>
                    <Editor
                      height="620px"
                      language={selectedLang === "html" ? "html" : selectedLang}
                      value={generatedCode}
                      theme="vs-dark"
                      options={{ minimap: { enabled: false }, fontSize: 15, wordWrap: "on", lineNumbers: "on", automaticLayout: true }}
                    />
                  </div>
                )}

                {/* Responsive sections */}
                {showWidgets.howItWorks && (
                  <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                )}

                {showWidgets.blog && (
                  <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-10">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogPosts.map((post) => (
                        <div key={post.id} onClick={() => setSelectedBlog(post)} className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 hover:border-violet-500 transition cursor-pointer">
                          <div className="text-sm text-violet-400 mb-2">{post.date}</div>
                          <h3 className="text-2xl font-semibold mb-4 leading-tight">{post.title}</h3>
                          <p className="text-zinc-400 mb-6">{post.excerpt}</p>
                          <button className="text-violet-400 hover:text-violet-300 font-medium">Read Full Article →</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Other pages remain the same but with better padding */}
            {currentView === "contact" && (
              <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-8 sm:p-12 text-center">
                <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
                <p className="text-zinc-400 mb-10">Have questions or feedback? We'd love to hear from you.</p>
                <a href="mailto:karhyoone@gmail.com" className="text-2xl text-violet-400 hover:text-violet-300">karhyoone@gmail.com</a>
              </div>
            )}

            {currentView === "privacy" && (
              <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-8 sm:p-12 prose prose-invert prose-lg leading-relaxed">
                <h2 className="text-5xl font-bold mb-10 text-center">Privacy Policy</h2>
                <p className="text-zinc-400 mb-8">Last updated: April 03, 2026</p>
                <h3>1. Introduction</h3>
                <p>CodeOmniverse operates the website and AI code generation service. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
                <p>By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
                <h3>2. Information We Collect</h3>
                <ul>
                  <li>Personal Information: Email and username when creating an account.</li>
                  <li>Usage Data: Prompts, language, generated code, timestamps.</li>
                  <li>Technical Data: IP address, browser type, device information.</li>
                </ul>
                <h3>3. How We Use Your Information</h3>
                <p>To provide and improve the service, store your history, respond to support, and comply with legal obligations.</p>
                <p>We do not use your prompts to train AI models.</p>
                <p className="mt-12 text-sm text-zinc-500">Contact us at karhyoone@gmail.com for any questions.</p>
              </div>
            )}

            {currentView === "terms" && (
              <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-8 sm:p-12 prose prose-invert prose-lg leading-relaxed">
                <h2 className="text-5xl font-bold mb-10 text-center">Terms of Service</h2>
                <p className="text-zinc-400 mb-8">Last updated: April 03, 2026</p>
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing or using CodeOmniverse, you agree to be bound by these Terms.</p>
                <h3>5. Generated Code</h3>
                <p>Code generated is provided for your use. You are responsible for testing and using it safely.</p>
                <p className="mt-12 text-sm text-zinc-500">Contact us at karhyoone@gmail.com for any questions.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Settings Modal - Mobile friendly */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg p-8 sm:p-10 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <SettingsIcon size={28} />
              <h2 className="text-3xl font-bold">Settings</h2>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold mb-4">Appearance</h3>
                <div className="flex gap-4">
                  <button onClick={() => setTheme("dark")} className={`flex-1 py-4 rounded-2xl border ${theme === "dark" ? "border-violet-500 bg-zinc-800" : "border-zinc-700"}`}>Dark Mode</button>
                  <button onClick={() => setTheme("light")} className={`flex-1 py-4 rounded-2xl border ${theme === "light" ? "border-violet-500 bg-zinc-800" : "border-zinc-700"}`}>Light Mode</button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Site Language</h3>
                <select value={siteLanguage} onChange={(e) => setSiteLanguage(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                </select>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Widgets & Visibility</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={showWidgets.howItWorks} onChange={() => setShowWidgets({...showWidgets, howItWorks: !showWidgets.howItWorks})} className="w-5 h-5 accent-violet-500" />
                    <span>How It Works Section</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={showWidgets.blog} onChange={() => setShowWidgets({...showWidgets, blog: !showWidgets.blog})} className="w-5 h-5 accent-violet-500" />
                    <span>Blog / Articles Section</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={showWidgets.examples} onChange={() => setShowWidgets({...showWidgets, examples: !showWidgets.examples})} className="w-5 h-5 accent-violet-500" />
                    <span>Example Prompts</span>
                  </label>
                </div>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="mt-10 w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium">
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <button onClick={() => setSelectedBlog(null)} className="float-right text-zinc-400 hover:text-white text-xl">✕</button>
            <div className="text-sm text-violet-400 mb-4">{selectedBlog.date}</div>
            <h2 className="text-4xl font-bold mb-8">{selectedBlog.title}</h2>
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
            <button onClick={() => setSelectedBlog(null)} className="mt-10 bg-zinc-800 hover:bg-zinc-700 px-8 py-3 rounded-2xl">Close Article</button>
          </div>
        </div>
      )}
    </div>
  );
}