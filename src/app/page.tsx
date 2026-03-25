"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ExternalLink, ChevronDown, Info, Code, Video, Mic, Scissors, Zap, Copy } from "lucide-react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "video" | "audio" | "editing" | "builder">("code");

  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoverLine, setHoverLine] = useState<number | null>(null);
  const [lineExplanation, setLineExplanation] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<any>(null);

  // Particle background (unchanged)
  useEffect(() => { /* ... your existing particle code ... */ }, []);

  // Fast Streaming Generation
  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedCode("");
    setLineExplanation("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language: selectedLang }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        setGeneratedCode((prev) => prev + buffer);
        buffer = "";
      }
    } catch (error) {
      setGeneratedCode("// Error generating code. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) navigator.clipboard.writeText(generatedCode);
    alert("Code copied!");
  };

  // Smart AI Hover Explanation
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.onMouseMove((e: any) => {
      const pos = e.target.position;
      if (!pos || !generatedCode) return;

      const lineNum = pos.lineNumber;
      if (hoverLine === lineNum) return;

      setHoverLine(lineNum);

      const lines = generatedCode.split("\n");
      const lineText = lines[lineNum - 1]?.trim();

      if (lineText) {
        // Call Grok for explanation of this specific line
        fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLang,
            line: lineText,
            context: generatedCode,
          }),
        })
          .then(r => r.json())
          .then(data => setLineExplanation(data.explanation || "No explanation available"))
          .catch(() => setLineExplanation("Could not get explanation"));
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Sidebar & Tabs - keep your existing sidebar and top tabs */}

      <main className="flex-1 pt-20 relative z-10 p-10">
        {activeTab === "code" && (
          <div className="max-w-6xl mx-auto">
            {/* Prompt Bar */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 mb-8">
              <div className="flex gap-4">
                <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
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
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500"
                />

                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-violet-600 hover:bg-violet-700 px-8 py-4 rounded-2xl font-medium"
                >
                  {isGenerating ? "Generating..." : "Generate Code"}
                </button>
              </div>
            </div>

            {generatedCode && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-4 bg-zinc-900 border-b flex justify-between">
                  <span>Generated {selectedLang} Code</span>
                  <button onClick={copyCode} className="flex items-center gap-2 text-zinc-400 hover:text-white">
                    <Copy size={18} /> Copy
                  </button>
                </div>
                <Editor
                  height="680px"
                  language={selectedLang === "html" ? "html" : selectedLang}
                  value={generatedCode}
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
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

            {/* AI Hover Explanation */}
            {lineExplanation && (
              <div className="mt-6 bg-zinc-900/80 border border-violet-500/30 rounded-2xl p-6 text-sm leading-relaxed">
                <div className="text-violet-400 font-medium mb-2">AI Explanation</div>
                {lineExplanation}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}