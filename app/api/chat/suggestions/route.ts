import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { CHATBOT_ENABLED } from "@/lib/features";

// Lazy initialization of Groq client
let client: Groq | null = null;
function getGroqClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

export async function POST(req: NextRequest) {
  if (!CHATBOT_ENABLED) {
    return Response.json({ suggestions: [] }, { status: 404 });
  }

  const { messages: rawMessages } = await req.json();
  const messages = Array.isArray(rawMessages) ? rawMessages.slice(-6) : [];

  try {
    const completion = await getGroqClient().chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 100,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Based on the conversation, suggest exactly 2 short follow-up questions the user might want to ask next about mineral water.
Return ONLY a JSON array of 2 strings, nothing else. Each question must be under 60 characters.
Example: ["Which brand has the lowest TDS?", "Is high TDS water safe to drink?"]`,
        },
        ...messages,
        {
          role: "user",
          content: "Give me 2 follow-up question suggestions as a JSON array.",
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
    // Extract JSON array from the response
    const match = raw.match(/\[.*\]/s);
    const suggestions = match ? JSON.parse(match[0]) : [];
    return Response.json({ suggestions: suggestions.slice(0, 2) });
  } catch {
    return Response.json({ suggestions: [] });
  }
}
