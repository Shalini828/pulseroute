import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function GatewayPage() {
  const [provider, setProvider] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    console.log("Button clicked");
    console.log({ provider, prompt });

    try {
      const apiKey =
        "pr_live_5e2e637dd2cec87ed8578e059e65b969bc556b53146491943b22e33b8e5566af";
      console.log("API KEY:", apiKey);
      console.log("REQUEST BODY:", {
        provider,
        prompt,
      });
      const res = await api.post(
        "/gateway",
        {
          provider,
          prompt,
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );
      console.log("Response:", res.data);
      setResponse(res.data.data.text);
      toast.success("Request sent successfully!");
      setPrompt("");
    } catch (err) {
      console.error("Gateway Error:", err);
      toast.error("Failed to send request.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Gateway</h1>

      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="gemini">Gemini</option>
        <option value="groq">Groq</option>
        <option value="openai">OpenAI</option>
      </select>

      <textarea
        className="w-full border rounded p-2"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>

      {response && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold mb-2">AI Response</h2>

          <p className="whitespace-pre-wrap text-slate-300">{response}</p>
        </div>
      )}
    </div>
  );
}
