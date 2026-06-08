import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

import {
  generatedIdeaPayloadSchema,
  generateIdeaRequestSchema,
  type GeneratedIdeaPayload,
  type GenerateIdeaRequest,
} from "@/lib/ai/generate-idea-contract";
import { getOpenAIModelName, hasOpenAIConfig } from "@/lib/ai/openai-config";
import { getMockAssetById } from "@/lib/mock-data";

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

  const parsedRequest = generateIdeaRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const asset = getMockAssetById(parsedRequest.data.assetId);

  if (!asset) {
    return Response.json(
      { error: "asset_not_found", message: "Selected asset does not exist." },
      { status: 404 },
    );
  }

  const generatedIdea =
    (await generateIdeaWithOpenAI(parsedRequest.data, asset)) ??
    buildMockGeneratedIdea(parsedRequest.data, asset);

  return Response.json({
    idea: generatedIdea,
  });
}

type MockIdeaAsset = NonNullable<ReturnType<typeof getMockAssetById>>;

async function generateIdeaWithOpenAI(
  request: GenerateIdeaRequest,
  asset: MockIdeaAsset,
): Promise<GeneratedIdeaPayload | null> {
  if (!hasOpenAIConfig()) {
    return null;
  }

  try {
    const { object } = await generateObject({
      model: openai.chat(getOpenAIModelName()),
      schema: generatedIdeaPayloadSchema,
      schemaName: "GeneratedMarketIdea",
      system: [
        "You are an editorial market research assistant for MarketPulse AI.",
        "Create concise, structured market idea drafts for an admin dashboard.",
        "Never promise returns. Never present the output as personalized financial advice.",
        "Always include risk notes, an invalidation scenario, and a clear disclaimer.",
      ].join(" "),
      prompt: buildGenerateIdeaPrompt(request, asset),
      temperature: 0.4,
      maxOutputTokens: 900,
    });

    return object;
  } catch (error) {
    console.error("OpenAI idea generation failed. Falling back to mock idea.", error);
    return null;
  }
}

function buildGenerateIdeaPrompt(request: GenerateIdeaRequest, asset: MockIdeaAsset) {
  const authorContext = request.authorContext?.trim() || "No extra author context.";

  return [
    `Asset: ${asset.name} (${asset.displaySymbol})`,
    `Asset type: ${asset.assetType}`,
    `Current mock price: ${asset.price}`,
    `24h/period change: ${asset.changePercent24h}%`,
    `Market mood: ${request.marketMood}`,
    `Content type: ${request.contentType}`,
    `Suggested action: ${request.suggestedAction}`,
    `Conviction: ${request.conviction}`,
    `Time horizon: ${request.timeHorizon}`,
    `Author context: ${authorContext}`,
    "Return only the structured object requested by the schema.",
  ].join("\n");
}

function buildMockGeneratedIdea(
  request: GenerateIdeaRequest,
  asset: MockIdeaAsset,
): GeneratedIdeaPayload {
  const actionLabel = formatOptionLabel(request.suggestedAction);
  const moodLabel = formatOptionLabel(request.marketMood);
  const horizonLabel = formatOptionLabel(request.timeHorizon);
  const contentLabel = formatOptionLabel(request.contentType);
  const directionText = {
    buy: "constructive upside setup",
    sell: "downside risk setup",
    hold: "hold-and-monitor setup",
    watch: "watchlist setup",
  }[request.suggestedAction];
  const authorContext = request.authorContext?.trim();

  return {
    title: `${asset.displaySymbol} ${actionLabel.toLowerCase()} idea for ${horizonLabel.toLowerCase()} traders`,
    thesis: [
      `${asset.name} is showing a ${directionText} while the current market mood is ${moodLabel.toLowerCase()}.`,
      `This mock ${contentLabel.toLowerCase()} frames the asset around price action, recent momentum, and whether the setup still has enough confirmation for the selected ${horizonLabel.toLowerCase()} horizon.`,
      authorContext ? `Author context: ${authorContext}` : null,
    ]
      .filter(Boolean)
      .join(" "),
    whyNow: [
      `${asset.displaySymbol} is currently marked as ${asset.marketMood} in the mock market data.`,
      `The selected editorial action is ${actionLabel.toLowerCase()} with ${request.conviction} conviction.`,
      `The idea is being prepared for a ${horizonLabel.toLowerCase()} observation window.`,
    ].join("\n"),
    riskNotes: [
      "Market conditions can change quickly and invalidate the setup.",
      "Volatility may create false breakouts, sharp reversals, or poor entry timing.",
      "This is a structured editorial idea, not a guaranteed outcome.",
    ].join("\n"),
    invalidationScenario: `The idea is invalidated if ${asset.displaySymbol} loses momentum, breaks the key setup area, or the broader market mood shifts against the ${request.suggestedAction} thesis.`,
    disclaimer: "Not financial advice. For educational purposes only.",
  };
}

function formatOptionLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
