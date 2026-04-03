"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Copy, User, X, Settings as SettingsIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  // History (now per user in Supabase)
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
    // ... your existing particle code remains exactly the same ...
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

  // Check auth state on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUsername(session.user.email?.split('@')[0] || "User");
        setUserId(session.user.id);
        loadUserHistory(session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
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
    const { data } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    
    if (data) {
      setHistory(data.map(item => ({
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
        const newEntry = {
          prompt,
          language: selectedLang,
          code: newCode,
          user_id: userId
        };

        await supabase.from('user_history').insert(newEntry);
        loadUserHistory(userId); // refresh history
      }
    } catch (error: any) {
      setGeneratedCode(`// Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account!");
      setShowAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      setShowAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUsername("");
    setUserId(null);
    setHistory([]);
  };

  // Rest of your code (examplePrompts, blogPosts, settings modal, etc.) remains exactly the same
  const examplePrompts = [ /* your list */ ];
  const blogPosts = [ /* your list */ ];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-zinc-100 text-zinc-900"} relative overflow-hidden`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Auth Gate - First thing users see */}
      {!isLoggedIn ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-12 text-center">
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
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium text-lg">
                {isLoginMode ? "Sign In" : "Create Account"}
              </button>
            </form>

            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="mt-6 text-violet-400 hover:text-violet-300"
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      ) : (
        // Your normal site content (home, contact, privacy, terms, settings, etc.)
        // ... paste the rest of your main content here (the part after the auth gate in previous versions)
        <main className="relative z-10 min-h-screen pt-16 pb-24 px-6">
          {/* Your full existing main content goes here */}
          {/* Navigation, Home view with generator, settings icon, etc. */}
        </main>
      )}

      {/* Keep your Settings, Auth (for switching), Blog modals here as before */}
    </div>
  );
}