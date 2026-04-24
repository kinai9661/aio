import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://api.aquadevs.com";

interface GenerateRequest {
  prompt: string;
  model?: string;
  size?: string;
  n?: number;
  seed?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, model = "flux-2", size = "1024x1024", n = 1 } = req.body as GenerateRequest;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.AQUA_API_KEY || "aqua_sk_24dd0b35d58c407685912dd7ed1fe5cd";

    const response = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model,
        size,
        n,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Aqua API error: ${response.status} ${errorText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Generation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
