import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://api.aquadevs.com";
const API_KEY = "aqua_sk_24dd0b35d58c407685912dd7ed1fe5cd";

interface GenerateRequest {
  prompt: string;
  model?: string;
  size?: string;
  n?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, model = "flux-2", size = "1024x1024", n = 1 } = req.body as GenerateRequest;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        model,
        size,
        n,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: `Aqua API error: ${response.status} ${errorData}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Image generation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}