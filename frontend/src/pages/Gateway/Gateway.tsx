import { useState } from "react";
import api from "../../services/api";
import { useProject } from "../../context/ProjectContext";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Bot,
  Send,
  Sparkles,
  SlidersHorizontal,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  Zap,
  Coins,
  CheckCircle2,
  Clock3,
  Database,
  Code2,
  FileText,
  Languages,
  Mail,
  SpellCheck,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function GatewayPage() {
  const { project } = useProject();
  const promptTemplates = [
    {
      title: "Explain Code",
      prompt: "Explain the following code step by step:\n\n",
      icon: Code2,
    },
    {
      title: "Summarize",
      prompt: "Summarize the following text:\n\n",
      icon: FileText,
    },
    {
      title: "Translate",
      prompt: "Translate the following text into English:\n\n",
      icon: Languages,
    },
    {
      title: "Write Email",
      prompt: "Write a professional email for:\n\n",
      icon: Mail,
    },
    {
      title: "Fix Grammar",
      prompt: "Correct the grammar of the following text:\n\n",
      icon: SpellCheck,
    },
    {
      title: "Generate SQL",
      prompt: "Write an SQL query for:\n\n",
      icon: Database,
    },
  ];
  const [provider, setProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const [responseInfo, setResponseInfo] = useState({
    provider: "",
    model: "",
    status: "",
    latency: 0,
    cached: false,
    createdAt: "",
    jobId: "",
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }
    if (!project?.id) {
      toast.error("No project selected.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const apiKey = import.meta.env.VITE_PULSEROUTE_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_PULSEROUTE_API_KEY is not configured.");
      }
      const res = await api.post(
        "/gateway/playground",
        {
          projectId: project?.id,
          endpoint: "/chat/completions",
          provider,
          payload: {
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            model,
            temperature,
            maxTokens,
          },
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      const jobId = res.data.jobId ?? res.data.data?.jobId;

      if (!jobId) {
        throw new Error("Job ID not returned.");
      }

      const interval = setInterval(async () => {
        try {
          const job = await api.get(`/jobs/${jobId}`);

          if (job.data.data.status === "COMPLETED") {
            clearInterval(interval);

            const result = job.data.data;

            setResponse(result.response);

            setResponseInfo({
              provider: result.provider || provider,
              model: result.model || model,
              status: result.status,
              latency: result.responseTime || 0,
              cached: result.cached || false,
              createdAt: result.createdAt || new Date().toISOString(),
              jobId,
            });

            setLoading(false);

            toast.success("Response generated!");
          }

          if (job.data.data.status === "FAILED") {
            clearInterval(interval);

            setLoading(false);

            toast.error(job.data.data.error);
          }
        } catch (err) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Request failed.");
      setLoading(false);
    }
  };

  const handleStream = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    if (!project?.id) {
      toast.error("No project selected.");
      return;
    }
    const startTime = performance.now();

    setStreaming(true);
    setResponse("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/api/v1/gateway/playground/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: project.id,
            endpoint: "/chat/completions",
            provider,
            payload: {
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              model,
              temperature,
              maxTokens,
              stream: true,
            },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Streaming request failed: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Streaming response body is empty.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");

        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data:")) continue;

          const data = event.replace(/^data:\s*/, "");

          if (data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.chunk) {
              setResponse((prev) => prev + parsed.chunk);
            }
          } catch {
            console.warn("Invalid streaming event:", data);
          }
        }
      }
      setResponseInfo({
        provider,
        model,
        status: "COMPLETED",
        latency: Math.round(performance.now() - startTime),
        cached: false,
        createdAt: new Date().toISOString(),
        jobId: "STREAM",
      });

      toast.success("Streaming response completed!");
    } catch (error) {
      console.error("Streaming error:", error);
      toast.error("Streaming request failed.");
    } finally {
      setStreaming(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;

    await navigator.clipboard.writeText(response);

    toast.success("Response copied!");
  };

  const downloadResponse = () => {
    if (!response) return;

    const blob = new Blob([response], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ai-response.txt";

    link.click();

    URL.revokeObjectURL(url);
  };

  const clearResponse = () => {
    setResponse("");

    setResponseInfo({
      provider: "",
      model: "",
      status: "",
      latency: 0,
      cached: false,
      createdAt: "",
      jobId: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#080d1c] text-slate-200">
      {/* MAIN CONTENT */}
      <DashboardLayout>
        <main className="w-full min-w-0">
          <div className="mx-auto max-w-6xl p-8">
            {/* Background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
              <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
            </div>

            <div className="relative w-full px-6 py-8 lg:px-10">
              {/* ================= HEADER ================= */}
              <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                    <span>Gateway</span>
                    <span>/</span>
                    <span className="text-slate-300">AI Playground</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20">
                      <Bot size={25} />
                    </div>

                    <div>
                      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        AI Playground
                      </h1>

                      <p className="mt-1 text-sm text-slate-400 lg:text-base">
                        Test, compare and interact with your AI gateway.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project status */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                    <Bot size={18} className="text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Current Project</p>
                    <p className="max-w-[180px] truncate text-sm font-semibold text-slate-200">
                      {project?.name || "No project selected"}
                    </p>
                  </div>

                  <span className="ml-2 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
              </header>

              {/* ================= PLAYGROUND ================= */}
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                {/* ================= LEFT PANEL ================= */}
                <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur">
                  {/* Panel Header */}
                  <div className="border-b border-slate-800 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                          <SlidersHorizontal
                            size={19}
                            className="text-blue-400"
                          />
                        </div>

                        <div>
                          <h2 className="font-semibold text-white">
                            Request Configuration
                          </h2>

                          <p className="text-xs text-slate-500">
                            Configure your AI request
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-400">
                        Playground
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 p-6">
                    {/* Provider + Model */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                          Provider
                        </label>

                        <select
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="gemini">Gemini</option>
                          <option value="groq">Groq</option>
                          <option value="openai">OpenAI</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                          Model
                        </label>

                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        >
                          <option value="gemini-2.5-flash">
                            Gemini 2.5 Flash
                          </option>

                          <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>

                          <option value="gpt-4o">GPT-4o</option>

                          <option value="llama-3.3-70b">Llama 3.3 70B</option>
                        </select>
                      </div>
                    </div>

                    {/* Temperature */}
                    {/* Temperature */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                          <Zap size={14} className="text-blue-400" />
                          Temperature
                        </label>

                        <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                          {temperature.toFixed(1)}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />

                      <div className="mt-2 flex justify-between text-[11px]">
                        <span className="text-slate-600">Precise</span>

                        <span className="text-slate-600">Creative</span>
                      </div>
                    </div>

                    {/* Max Tokens */}
                    {/* Max Tokens */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                          <Coins size={14} className="text-amber-400" />
                          Max Tokens
                        </label>

                        <span className="text-[11px] font-medium text-slate-600">
                          Maximum output
                        </span>
                      </div>

                      <div className="relative">
                        <Coins
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
                        />

                        <input
                          type="number"
                          min={1}
                          max={4096}
                          value={maxTokens}
                          onChange={(e) => {
                            const value = Math.min(
                              4096,
                              Math.max(1, Number(e.target.value)),
                            );
                            setMaxTokens(value);
                          }}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pl-11 pr-20 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                          / 4096
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          Maximum number of tokens to generate
                        </span>

                        <span className="text-[11px] font-medium text-slate-500">
                          {maxTokens} tokens
                        </span>
                      </div>
                    </div>
                    {/* Prompt */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Prompt
                          </label>
                          <p className="mt-1 text-xs text-slate-600">
                            Describe what you want the AI to generate
                          </p>
                        </div>

                        <span
                          className={
                            prompt.length > 3500
                              ? "rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400"
                              : "rounded-md bg-slate-800/70 px-2 py-1 text-xs font-medium text-slate-500"
                          }
                        >
                          {prompt.length}/4000
                        </span>
                      </div>

                      {/* Prompt Templates */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        {promptTemplates.map((template) => {
                          const TemplateIcon = template.icon;
                          return (
                            <button
                              key={template.title}
                              type="button"
                              onClick={() => setPrompt(template.prompt)}
                              className="group flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                            >
                              <TemplateIcon
                                size={14}
                                className="shrink-0 text-slate-500 transition-colors group-hover:text-blue-300"
                              />
                              {template.title}
                            </button>
                          );
                        })}
                      </div>

                      {/* Editor */}
                      <div className="group overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1220] transition-all duration-200 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
                        <textarea
                          rows={9}
                          maxLength={4000}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.ctrlKey && e.key === "Enter") {
                              e.preventDefault();
                              handleSubmit();
                            }
                          }}
                          placeholder="Ask anything..."
                          className="min-h-[220px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600"
                        />

                        {/* Editor Footer */}
                        <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-900/30 px-4 py-2.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-sans text-slate-500">
                              Ctrl
                            </kbd>

                            <span>+</span>

                            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-sans text-slate-500">
                              Enter
                            </kbd>

                            <span className="ml-1">to generate</span>
                          </div>

                          <span className="text-[11px] text-slate-600">
                            {prompt.length} characters
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={handleSubmit}
                        disabled={loading || streaming}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={17} />

                        {loading ? "Generating..." : "Generate Response"}
                      </button>

                      <button
                        onClick={handleStream}
                        disabled={loading || streaming}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Sparkles size={17} />

                        {streaming ? "Streaming..." : "Stream Response"}
                      </button>
                    </div>
                  </div>
                </section>

                {/* ================= RIGHT PANEL ================= */}
                <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur">
                  {/* Response Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <Sparkles size={19} className="text-purple-400" />
                      </div>

                      <div>
                        <h2 className="font-semibold text-white">
                          AI Response
                        </h2>

                        <p className="text-xs text-slate-500">
                          Generated output
                        </p>
                      </div>
                    </div>

                    {response && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    {response ? (
                      <div className="space-y-5">
                        {/* Response actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={copyResponse}
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                          >
                            <Copy size={16} />
                            Copy
                          </button>

                          <button
                            onClick={downloadResponse}
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                          >
                            <Download size={16} />
                            Download
                          </button>

                          <button
                            onClick={handleSubmit}
                            disabled={loading || !prompt.trim() || !response}
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400 disabled:opacity-50"
                          >
                            <RefreshCw size={16} />
                            Regenerate
                          </button>

                          <button
                            onClick={clearResponse}
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                            Clear
                          </button>
                        </div>

                        {/* Response content */}
                        <div className="h-[520px] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0b1220] p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
                          <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-sm leading-6 text-slate-200 prose prose-invert max-w-none">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
                                  <Sparkles
                                    size={14}
                                    className="text-purple-400"
                                  />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-slate-200">
                                    Generated Response
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    AI-generated output
                                  </p>
                                </div>
                              </div>

                              <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Completed
                              </span>
                            </div>
                            <ReactMarkdown
                              components={{
                                code({
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }: any) {
                                  const match = /language-(\w+)/.exec(
                                    className || "",
                                  );
                                  return !inline && match ? (
                                    <div className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                                      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                          {match[1]}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              String(children).replace(
                                                /\n$/,
                                                "",
                                              ),
                                            );
                                            toast.success("Code copied!");
                                          }}
                                          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400"
                                        >
                                          <Copy size={14} />
                                          Copy code
                                        </button>
                                      </div>

                                      <SyntaxHighlighter
                                        style={oneDark as any}
                                        language={match[1]}
                                        PreTag="div"
                                        className="!m-0 !rounded-none !border-0"
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, "")}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code
                                      className="rounded bg-slate-800 px-1.5 py-0.5 text-blue-300"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {response}
                            </ReactMarkdown>
                          </article>
                        </div>

                        {/* Response metadata */}
                        {/* Response metadata */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {/* Provider */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <Bot size={14} className="text-blue-400" />
                              <p className="text-xs text-slate-500">Provider</p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-200">
                              {responseInfo.provider || "—"}
                            </p>
                          </div>

                          {/* Model */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="text-purple-400" />
                              <p className="text-xs text-slate-500">Model</p>
                            </div>

                            <p className="mt-2 truncate text-sm font-semibold text-slate-200">
                              {responseInfo.model || "—"}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                size={14}
                                className="text-emerald-400"
                              />
                              <p className="text-xs text-slate-500">Status</p>
                            </div>

                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              {responseInfo.status || "Ready"}
                            </p>
                          </div>

                          {/* Latency */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <Clock3 size={14} className="text-blue-400" />
                              <p className="text-xs text-slate-500">Latency</p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-blue-400">
                              {responseInfo.latency
                                ? `${responseInfo.latency} ms`
                                : "—"}
                            </p>
                          </div>

                          {/* Cache */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <Database size={14} className="text-purple-400" />
                              <p className="text-xs text-slate-500">Cache</p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-200">
                              {responseInfo.cached ? "Hit" : "Miss"}
                            </p>
                          </div>

                          {/* Job ID */}
                          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-slate-400" />
                              <p className="text-xs text-slate-500">Job ID</p>
                            </div>

                            <code className="mt-2 block truncate text-xs text-blue-400">
                              {responseInfo.jobId || "—"}
                            </code>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty response state */
                      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#0b1220] px-6 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                          <Sparkles size={28} className="text-purple-400" />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-300">
                          Ready for your prompt
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                          Configure your provider, write a prompt, and generate
                          an AI response to see the result here.
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                          Your response will appear here
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </div>
  );
}
