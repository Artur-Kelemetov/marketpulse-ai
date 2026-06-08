import { createDraftRequestSchema } from "@/lib/drafts/create-draft-contract";
import { createPersistedDraftFromIdea } from "@/lib/drafts/drafts-repository";
import { getPersistedMarketIdeaById } from "@/lib/ideas/market-ideas-repository";

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

  const parsedRequest = createDraftRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const idea = getPersistedMarketIdeaById(parsedRequest.data.ideaId);

  if (!idea) {
    return Response.json(
      {
        error: "idea_not_found",
        message: "Only saved SQLite ideas can be converted into drafts.",
      },
      { status: 404 },
    );
  }

  const draft = createPersistedDraftFromIdea(idea);

  return Response.json({
    draft: {
      id: draft.id,
      ideaId: draft.ideaId,
      title: draft.title,
      status: draft.status,
      createdAt: draft.createdAt,
    },
  });
}
