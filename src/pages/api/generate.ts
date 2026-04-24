import type { Context } from "hono";
import { Image } from "openai/resources/images.mjs";

const BASE_URL = "https://api.aquadevs.com";
const API_KEY = "aqua_sk_24dd0b35d58c407685912dd7ed1fe5cd";

interface GenerateRequest {
  prompt: string;
  model?: string;
  size?: string;
  n?: number;
  seed?: number;
}

interface AquaImageResponse {
  created: number;
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

export default async (c: Context) => {
  try {
    const body: GenerateRequest = await c.req.json();

    if (!body.prompt || typeof body.prompt !== "string") {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const { prompt, model = "flux-1-dev", size = "1024x1024", n = 1, seed } = body;

    // Map model names to Aqua API format
    const modelMap: Record<string, string> = {
      "flux-1-dev": "flux-1-dev",
      "flux-1-schnell": "flux-1-schnell",
      "flux-2-dev": "flux-2-dev",
    };

    const mappedModel = modelMap[model] || model;

    // Build request to Aqua API
    const requestBody: Record<string, unknown> = {
      model: mappedModel,
      prompt,
      size,
      n,
    };

    if (seed) {
      requestBody.seed = seed;
    }

    const response = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Aqua API error:", response.status, errorText);
      return c.json(
        { error: `Aqua API error: ${response.status} ${errorText}` },
        response.status
      );
    }

    const data: AquaImageResponse = await response.json();

    // Transform response to match our frontend expectations
    const images = data.data.map((img) => ({
      url: img.url,
      revised_prompt: img.revised_prompt,
    }));

    return c.json({ images });
  } catch (err) {
    console.error("Generate error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
