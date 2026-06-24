import Groq from "groq-sdk";
import { getScoringPrompt } from "@/lib/prompts";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { userPosition, messages } = await request.json();

  const scoringPrompt = getScoringPrompt(userPosition, messages);

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [{ role: "user", content: scoringPrompt }],
    });

    const text = response.choices[0]?.message?.content ?? "";

    // Strip markdown code fences if the model wraps JSON in them
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const score = JSON.parse(cleaned);
    return Response.json(score);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Scoring failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
