"use client";

import { useState, useEffect, useRef } from "react";
import { createClient, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { Copy, User, X, Settings as SettingsIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

// Lazy Supabase client - prevents build-time error
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

  // Handle Supabase Auth (including magic link callback)
  useEffect(() => {
    const supabase = getSupabase();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUsername(session.user.email?.split('@')[0] || "User");
        setUserId(session.user.id);
        loadUserHistory(session.user.id);
      }
    });

    // Listen for auth changes (including after clicking email link)
    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 text-white font-bold text-6xl">
              C
            </div>
            <h1 className="text-4xl font-bold mb-3">Welcome to CodeOmniverse</h1>
            <p className="text-zinc-400 mb-10">Sign in or create an account to start generating code</p>

            <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-6">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg" required />
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium text-lg">
                {isLoginMode ? "Sign In" : "Create Account"}
              </button>
            </form>

            <button onClick={() => setIsLoginMode(!isLoginMode)} className="mt-6 text-violet-400 hover:text-violet-300">
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      ) : (
        // Normal site content
        <main className="relative z-10 min-h-screen pt-16 pb-24 px-6">
          {/* Your full navigation + generator + settings + modals go here */}
          {/* Paste the rest of your main content from previous version here */}
        </main>
      )}

      {/* Settings Modal, Blog Modal, etc. remain the same */}
    </div>
  );
}