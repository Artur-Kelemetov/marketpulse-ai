import { createPersistedMarketIdea } from "@/lib/ideas/market-ideas-repository";
import { createIdeaRequestSchema } from "@/lib/ideas/create-idea-contract";
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

  const parsedRequest = createIdeaRequestSchema.safeParse(body);

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

  const idea = createPersistedMarketIdea(parsedRequest.data, asset);

  return Response.json({ idea });
}
