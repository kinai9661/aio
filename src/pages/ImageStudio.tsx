import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Download, Loader2, RefreshCw, Zap, Image as ImageIcon } from "lucide-react";

const MODELS = [
  { id: "flux-2", name: "Flux 2", description: "High quality image generation" },
  { id: "gptimage-2", name: "GPT Image 2", description: "Latest OpenAI image model" },
  { id: "imagen4", name: "Imagen 4", description: "Google's image generation" },
  { id: "nanobanana", name: "NanoBanana", description: "Fast and efficient" },
  { id: "zimage", name: "ZImage", description: "Enhanced detail" },
  { id: "midjourney", name: "Midjourney 7", description: "Artistic generation" },
];

const SIZES = [
  { id: "1024x1024", name: "1:1", desc: "Square" },
  { id: "1024x1792", name: "9:16", desc: "Portrait" },
  { id: "1792x1024", name: "16:9", desc: "Landscape" },
  { id: "1024x1360", name: "3:4", desc: "Portrait 3:4" },
  { id: "1360x1024", name: "4:3", desc: "Landscape 4:3" },
];

const COUNTS = [1, 2, 4];

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux-2");
  const [size, setSize] = useState("1024x1024");
  const [count, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [seed] = useState(Math.floor(Math.random() * 999999999));

  const generate = async () => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    setError("");
    setImages([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, size, n: count, seed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      const urls = data.data?.map((img: { url?: string; b64_json?: string }) => 
        img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : "")
      ).filter(Boolean) || [];
      
      setImages(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `aqua-image-${seed}-${index + 1}.png`;
    link.click();
  };

  const regenerate = () => {
    generate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aqua Image Studio</h1>
              <p className="text-xs text-slate-400">AI-Powered Image Generation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400">Powered by Aqua API</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  Create Image
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter a detailed description for your AI-generated image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic mountain landscape at sunset with golden light, highly detailed, 8K resolution..."
                    className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">AI Model</label>
                  <div className="grid grid-cols-2 gap-3">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          model === m.id
                            ? "border-cyan-500 bg-cyan-500/10 text-white"
                            : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{m.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Image Size</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          size === s.id
                            ? "border-cyan-500 bg-cyan-500/10 text-white"
                            : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-slate-500 ml-1">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Count Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Number of Images</label>
                  <div className="flex gap-2">
                    {COUNTS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setCount(n)}
                        className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                          count === n
                            ? "border-cyan-500 bg-cyan-500/10 text-white"
                            : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {n} {n === 1 ? "image" : "images"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generate}
                  disabled={!prompt.trim() || generating}
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-lg rounded-xl shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* API Info Card */}
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  API Status: Connected
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  Endpoint: api.aquadevs.com
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <Card className="bg-red-900/20 border-red-800/50">
                <CardContent className="p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {generating && (
              <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <p className="text-slate-400">Creating your masterpiece...</p>
                  <p className="text-slate-500 text-sm mt-2">This may take a few seconds</p>
                </CardContent>
              </Card>
            )}

            {/* Generated Images */}
            {!generating && images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Generated Images</h3>
                  <Button onClick={regenerate} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                <div className="grid gap-4">
                  {images.map((url, index) => (
                    <Card key={index} className="bg-slate-900/80 border-slate-800 overflow-hidden">
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Generated image ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <Button
                            onClick={() => downloadImage(url, index)}
                            size="sm"
                            className="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!generating && images.length === 0 && !error && (
              <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                    <ImageIcon className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No Images Yet</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Enter a prompt and click Generate to create AI-powered images with state-of-the-art models
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-slate-500">
          <p>Powered by Aqua API • Generate images with state-of-the-art AI models</p>
        </div>
      </footer>
    </div>
  );
}
