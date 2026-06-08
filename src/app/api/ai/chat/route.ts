import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getOpenAIModelName, hasOpenAIConfig } from "@/lib/ai/openai-config";

export const maxDuration = 30;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const messages = getMessagesFromBody(body);

  if (!messages) {
    return Response.json(
      {
        error: "invalid_request",
        message: "Request body must include a messages array.",
      },
      { status: 400 },
    );
  }

  if (!hasOpenAIConfig()) {
    return Response.json(
      {
        error: "openai_not_configured",
        message:
          "Add a real OPENAI_API_KEY to .env.local or Vercel environment variables to use chat.",
      },
      { status: 400 },
    );
  }

  const result = streamText({
    model: openai.chat(getOpenAIModelName()),
    system: [
      "You are MarketPulse AI chat, an assistant inside an admin dashboard for market idea research.",
      "Help the user analyze assets, market ideas, drafts, scheduling, and publication safety.",
      "Keep responses concise and practical.",
      "Do not provide personalized financial advice, guarantees, or instructions to buy or sell.",
      "When discussing markets, frame ideas as educational research and include risk awareness.",
    ].join(" "),
    messages: await convertToModelMessages(messages),
    temperature: 0.3,
    maxOutputTokens: 700,
  });

  return result.toUIMessageStreamResponse();
}

function getMessagesFromBody(body: unknown): UIMessage[] | null {
  if (!body || typeof body !== "object" || !("messages" in body)) {
    return null;
  }

  const messages = (body as { messages: unknown }).messages;

  return Array.isArray(messages) ? (messages as UIMessage[]) : null;
}
