// ==========================================
// Chat API Route (Kek Lapis Expert Assistant)
// POST /api/chat
// ==========================================
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { error: "API key not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format provided." },
        { status: 400 }
      );
    }

    // Convert frontend messages format to Gemini contents format
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const latestMessage = messages[messages.length - 1].content;

    // System instruction to guide the AI persona about your project and Kek Lapis Sarawak
    const systemInstruction = 
      "You are the official AI Copilot for this Kek Lapis project web app. " +
      "Your job is to assist users with baking guides, ingredient layering techniques, and share rich cultural details about authentic Kek Lapis Sarawak (the famous multi-layered Malaysian cake from Sarawak known for its intricate patterns, rich spices like cinnamon and cardamom, and meticulous baking layer by layer). " +
      "Be helpful, friendly, culturally accurate, and concise.";

    let responseText = "";

    // Try primary model, fallback gracefully if unavailable
    const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash"];
    let success = false;

    for (const modelName of modelsToTry) {
      try {
        const chat = ai.chats.create({
          model: modelName,
          history: history,
          config: {
            systemInstruction: systemInstruction,
          },
        });

        const response = await chat.sendMessage({
          message: latestMessage,
        });

        if (response.text) {
          responseText = response.text;
          success = true;
          break;
        }
      } catch (modelError) {
        console.warn(`Model ${modelName} failed, trying next fallback...`, modelError);
      }
    }

    if (!success || !responseText) {
      throw new Error("All fallback Gemini models failed to generate a response.");
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response from AI Assistant. Please check server console." },
      { status: 500 }
    );
  }
}