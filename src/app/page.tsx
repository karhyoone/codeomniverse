"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ExternalLink, ChevronDown, Info, Code, Video, Mic, Scissors, Zap, Copy, BookOpen, PlayCircle, List, Image, Users, Home as HomeIcon, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";

// ... (Keep your categories array exactly as it was)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "video" | "audio" | "editing" | "builder">("code");
  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  
  // NEW: State for Media Results
  const [generatedCode, setGeneratedCode] = useState("// Your generated code will appear here...");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ... (Keep your entire Particle Background useEffect exactly as it was)

  // IMPROVED: Unified Generation Logic
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setMediaUrl(null);
    if (activeTab === "code") setGeneratedCode("// Generating specialized code...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          type: activeTab, // Tells the backend what to make
          language: selectedLang 
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (activeTab === "code") {
        let code = data.output || "";
        code = code.replace(/```[\w]*\n?/g, '').replace(/```\s*$/g, '').trim();
        setGeneratedCode(code || "// No code was generated.");
      } else {
        // For video/audio, data.output will be a URL (Cloudinary, Replicate, or Vercel Blob)
        setMediaUrl(data.output);
      }
    } catch (error: any) {
      console.error("Generation error:", error);
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

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Sidebar - Remains functional as per your original */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-xl flex flex-col h-screen overflow-y-auto z-10">
        <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
                <h1 className="text-2xl font-bold tracking-tighter">CodeOmniverse</h1>
            </div>
            {/* Search and Categories logic remains here... */}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen z-10 relative">
        {/* Navigation Tabs */}
        <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-black/40 backdrop-blur-md">
          <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            {[
                { id: "code", icon: Code, label: "Code" },
                { id: "video", icon: Video, label: "Video" },
                { id: "audio", icon: Mic, label: "Audio" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-zinc-800 text-zinc-400'}`}
              >
                <tab.icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col p-8 overflow-hidden">
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden relative group">
            {activeTab === "code" ? (
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedLang}
                value={generatedCode}
                options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 } }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-zinc-400 animate-pulse text-lg">Creating your {activeTab} masterpiece...</p>
                  </div>
                ) : mediaUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-2xl p-4">
                    {activeTab === "video" ? (
                      <video src={mediaUrl} controls className="max-h-full rounded-xl shadow-2xl border border-zinc-700" />
                    ) : (
                      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl border border-zinc-700">
                        <div className="flex items-center gap-4 mb-6">
                           <Mic className="text-blue-500" />
                           <span className="font-medium text-zinc-300">Generated Voiceover</span>
                        </div>
                        <audio src={mediaUrl} controls className="w-full" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeTab === "video" ? <Video className="text-zinc-500" /> : <Mic className="text-zinc-500" />}
                    </div>
                    <p className="text-zinc-500 text-lg">Describe your {activeTab} below to begin</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "code" && (
                <button onClick={copyCode} className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors">
                    <Copy size={18} className="text-zinc-300" />
                </button>
            )}
          </div>

          {/* Input Panel */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${activeTab} you want to create...`}
                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                Generate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
