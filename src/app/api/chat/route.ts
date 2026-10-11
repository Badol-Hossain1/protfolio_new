import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 12;

/** Calls an OpenAI-compatible chat completions endpoint.
 *  Credential sources, in order:
 *  1. OPENAI_API_KEY (+ optional OPENAI_BASE_URL / OPENAI_MODEL) env vars
 *  2. z-ai-web-dev-sdk (reads .z-ai-config from project/home//etc) */
async function callAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      throw new Error(`AI provider error ${res.status}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");
    return content;
  }

  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages,
    temperature: 0.4,
  });
  const content = completion?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return content;
}

export async function POST(request: Request) {
  let messages: ChatMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }
    messages = body.messages
      .filter(
        (m: ChatMessage) =>
          m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
      )
      .slice(-MAX_HISTORY);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Ground the assistant in the live site content so answers match what
  // the visitor is looking at — including edits just made in /admin
  const content = await getContent();

  const systemPrompt = [
    `You are the portfolio assistant for ${content.profile.name}, a ${content.profile.role} with ${content.profile.yearsExperience} years of experience.`,
    "Answer visitor questions about their skills, experience, projects and background using ONLY the data below.",
    "If something is not in the data, say you don't know and suggest emailing the provided address.",
    "Be concise, warm and professional — you are talking to potential employers or clients. Reply in the visitor's language.",
    "",
    "SITE CONTENT:",
    JSON.stringify(content),
  ].join("\n");

  try {
    const reply = await callAI([
      { role: "system", content: systemPrompt },
      ...messages,
    ]);
    return NextResponse.json({ reply });
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    console.error("[chat] AI request failed:", cause);
    const unconfigured = cause.includes("Configuration file not found") || cause.includes("401");
    return NextResponse.json(
      {
        error: unconfigured
          ? "Chat is not configured yet — add OPENAI_API_KEY to .env.local (or a .z-ai-config file) to enable it."
          : "Chat is temporarily unavailable. Please try again later, or reach out by email.",
      },
      { status: 503 }
    );
  }
}
