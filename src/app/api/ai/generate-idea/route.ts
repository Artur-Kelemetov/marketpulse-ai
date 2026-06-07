import {
  generateIdeaRequestSchema,
  type GenerateIdeaRequest,
} from "@/lib/ai/generate-idea-contract";
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

  return Response.json({
    idea: buildMockGeneratedIdea(parsedRequest.data, asset),
  });
}

type MockIdeaAsset = NonNullable<ReturnType<typeof getMockAssetById>>;

function buildMockGeneratedIdea(request: GenerateIdeaRequest, asset: MockIdeaAsset) {
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
