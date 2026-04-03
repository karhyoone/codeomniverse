"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, User, X, Settings as SettingsIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

interface HistoryEntry {
  id: number;
  prompt: string;
  language: string;
  code: string;
  timestamp: string;
}

interface User {
  email: string;
  username: string;
  password: string;
  history: HistoryEntry[];
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

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  // Load user
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      const user = JSON.parse(saved) as User;
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUsername(user.username);
      setHistory(user.history || []);
    }
  }, []);

  const saveUser = (user: User) => {
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

      if (isLoggedIn && currentUser) {
        const newEntry: HistoryEntry = {
          id: Date.now(),
          prompt,
          language: selectedLang,
          code: newCode,
          timestamp: new Date().toISOString()
        };
        const updatedHistory = [newEntry, ...history];
        setHistory(updatedHistory);
        const updatedUser = { ...currentUser, history: updatedHistory };
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
      alert("Code copied!");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");
    const newUser: User = { 
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
    alert("Account created successfully!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem("currentUser");
    if (!saved) return alert("No account found. Please sign up.");
    const user = JSON.parse(saved) as User;
    if (user.email === email && user.password === password) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUsername(user.username);
      setHistory(user.history || []);
      setShowAuth(false);
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

  const blogPosts: BlogPost[] = [
    { 
      id: 1, 
      title: "How to Build a React Todo App with AI in Under 5 Minutes", 
      date: "March 2026", 
      excerpt: "Learn how to use CodeOmniverse to generate a fully functional todo app with dark mode and persistence.", 
      content: `<h3>Why Use AI for Todo Apps?</h3><p>Building a todo app is a classic beginner project. With CodeOmniverse, you can generate the entire app in seconds.</p>` 
    },
    { 
      id: 2, 
      title: "Best AI Coding Tools Comparison 2026", 
      date: "March 2026", 
      excerpt: "We tested Grok, Claude, Cursor, and more.", 
      content: `<p>In 2026, AI coding assistants are essential.</p>` 
    },
    { 
      id: 3, 
      title: "Python Automation Scripts You Can Generate Instantly", 
      date: "February 2026", 
      excerpt: "From data analysis to web scraping.", 
      content: `<p>Generate scripts for CSV analysis and more in seconds.</p>` 
    },
    { 
      id: 4, 
      title: "Prompt Engineering Tips for Better Code Generation", 
      date: "February 2026", 
      excerpt: "How to write prompts that give you cleaner code.", 
      content: `<p>Be specific about language and features.</p>` 
    }
  ];

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-zinc-100 text-zinc-900"} relative overflow-hidden`}>
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

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">Hi, {username}</span>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-2xl text-sm transition">
                  <User size={18} /> Login / Signup
                </button>
              )}

              <button 
                onClick={() => setShowSettings(true)}
                className="p-3 hover:bg-zinc-800 rounded-2xl transition"
                title="Settings"
              >
                <SettingsIcon size={22} />
              </button>
            </div>
          </div>

          {/* HOME VIEW */}
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

              {showWidgets.howItWorks && (
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
              )}

              {showWidgets.blog && (
                <div className="mb-20">
                  <h2 className="text-4xl font-bold text-center mb-12">Latest Articles</h2>
                  <div className="grid md:grid-cols-2 gap-8">
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

          {/* CONTACT */}
          {currentView === "contact" && (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
              <p className="text-zinc-400 mb-10">Have questions or feedback? We'd love to hear from you.</p>
              <a href="mailto:karhyoone@gmail.com" className="text-2xl text-violet-400 hover:text-violet-300">karhyoone@gmail.com</a>
            </div>
          )}

          {/* FULL PRIVACY POLICY */}
          {currentView === "privacy" && (
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 prose prose-invert prose-lg leading-relaxed overflow-auto max-h-[85vh]">
              <h2 className="text-5xl font-bold mb-10 text-center">Privacy Policy</h2>
              <p className="text-zinc-400 mb-8">Last updated: April 03, 2026</p>

              <h3>1. Introduction</h3>
              <p>CodeOmniverse ("we", "us", or "our") provides an AI-powered code generation platform. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our Service.</p>
              <p>By using CodeOmniverse, you consent to the practices described in this policy.</p>

              <h3>2. Information We Collect</h3>
              <p>We collect the following categories of information:</p>
              <ul>
                <li><strong>Account Information:</strong> Email address and username when you create or log into an account.</li>
                <li><strong>Usage Data:</strong> Prompts you submit, selected programming languages, generated code, and interaction timestamps.</li>
                <li><strong>Technical Information:</strong> IP address, browser type and version, device type, operating system, and usage analytics.</li>
                <li><strong>Stored History:</strong> Your previous generations are saved locally in your browser when you are logged in.</li>
              </ul>

              <h3>3. How We Use Your Information</h3>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide, operate, and improve the AI code generation service</li>
                <li>Save and display your personal generation history</li>
                <li>Respond to your support requests and communications</li>
                <li>Monitor and prevent abuse, fraud, or technical issues</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
              <p>Important: We do not use your submitted prompts to train or improve any underlying AI models. All generation is performed in real time.</p>

              <h3>4. Sharing and Disclosure</h3>
              <p>We do not sell your personal data. We may share information only in limited circumstances:</p>
              <ul>
                <li>With trusted service providers who help us operate the platform (e.g., hosting services)</li>
                <li>When required by law, court order, or government request</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>

              <h3>5. Data Security</h3>
              <p>We implement reasonable administrative, technical, and physical security measures to protect your information. However, no internet transmission or electronic storage method is 100% secure. We cannot guarantee absolute security.</p>

              <h3>6. Your Rights and Choices</h3>
              <p>You may request access to, correction of, or deletion of your personal data by contacting us. You can also delete your local history by logging out and clearing your browser data.</p>

              <h3>7. Children's Privacy</h3>
              <p>Our Service is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

              <h3>8. International Data Transfers</h3>
              <p>Your data may be processed in countries outside your jurisdiction. By using the Service, you consent to such transfers.</p>

              <h3>9. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy from time to time. We will notify you by posting the new version on this page and updating the "Last updated" date. Continued use of the Service constitutes acceptance of the changes.</p>

              <p className="mt-12 text-sm text-zinc-500">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:karhyoone@gmail.com" className="text-violet-400">karhyoone@gmail.com</a>.</p>
            </div>
          )}

          {/* FULL TERMS OF SERVICE */}
          {currentView === "terms" && (
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-12 prose prose-invert prose-lg leading-relaxed overflow-auto max-h-[85vh]">
              <h2 className="text-5xl font-bold mb-10 text-center">Terms of Service</h2>
              <p className="text-zinc-400 mb-8">Last updated: April 03, 2026</p>

              <h3>1. Acceptance of Terms</h3>
              <p>By accessing or using CodeOmniverse, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you must not use the Service.</p>

              <h3>2. Description of the Service</h3>
              <p>CodeOmniverse is an AI-powered platform that generates code based on user prompts. The Service is provided "as is" and "as available" without any warranties of any kind.</p>

              <h3>3. User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access to your account.</p>

              <h3>4. User Prompts and Content</h3>
              <p>You retain ownership of the prompts you submit. By submitting a prompt, you grant us a limited, non-exclusive license to use it solely to generate code for you. You are solely responsible for ensuring your prompts do not violate any laws or third-party rights.</p>

              <h3>5. Generated Code</h3>
              <p>The code generated by the Service is provided for your personal or commercial use. We make no ownership claim over the generated code. However, due to the nature of AI, similar or identical code may be generated for other users. You are fully responsible for reviewing, testing, debugging, and ensuring the safety and correctness of any generated code before using it in production.</p>

              <h3>6. Prohibited Conduct</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any illegal, harmful, or unauthorized purpose</li>
                <li>Attempt to reverse engineer, decompile, or interfere with the Service</li>
                <li>Submit prompts that are abusive, hateful, or infringe intellectual property rights</li>
                <li>Overload, disrupt, or attempt to gain unauthorized access to the Service</li>
              </ul>

              <h3>7. Intellectual Property</h3>
              <p>All rights, title, and interest in the Service, its design, technology, and branding belong to CodeOmniverse or its licensors. You may not copy, modify, distribute, or create derivative works of the Service without prior written permission.</p>

              <h3>8. Disclaimers and Limitation of Liability</h3>
              <p>The Service is provided without any warranties, express or implied. We are not liable for any damages, losses, or issues arising from the use or inability to use the Service, including any bugs, security vulnerabilities, or incorrect functionality in generated code. Our total liability shall not exceed the amount you paid us (which is zero in the current demo version).</p>

              <h3>9. Termination</h3>
              <p>We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for conduct that violates these Terms.</p>

              <h3>10. Governing Law</h3>
              <p>These Terms shall be governed by the laws of the United Arab Emirates. Any disputes shall be resolved exclusively in the courts of Dubai.</p>

              <h3>11. Changes to Terms</h3>
              <p>We may update these Terms from time to time. Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>

              <p className="mt-12 text-sm text-zinc-500">If you have any questions about these Terms of Service, please contact us at <a href="mailto:karhyoone@gmail.com" className="text-violet-400">karhyoone@gmail.com</a>.</p>
            </div>
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg p-10 relative">
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
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500" required />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500" required />
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

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10">
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