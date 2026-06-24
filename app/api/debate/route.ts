import Groq from "groq-sdk";
import { getDebateSystemPrompt, type Difficulty } from "@/lib/prompts";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { userPosition, difficulty, messages, round, totalRounds } =
    await request.json();

  const systemPrompt = getDebateSystemPrompt(
    userPosition,
    difficulty as Difficulty,
    totalRounds
  );

  const formattedMessages = messages.map(
    (m: { role: string; content: string }, i: number) => ({
      role: m.role as "user" | "assistant",
      content:
        i === messages.length - 1 && m.role === "user"
          ? `[Round ${round} of ${totalRounds}] ${m.content}`
          : m.content,
    })
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedMessages,
          ],
        });

        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "API error";
        controller.enqueue(encoder.encode(`__ERROR__:${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
