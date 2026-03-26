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
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setGeneratedCode(data.code || "// No code was returned from the API.");
  } catch (error: any) {
    console.error("Generation error:", error);
    setGeneratedCode(`// Error: ${error.message || "Failed to connect to AI. Please check your API key in Vercel."}`);
  } finally {
    setIsGenerating(false);
  }
};