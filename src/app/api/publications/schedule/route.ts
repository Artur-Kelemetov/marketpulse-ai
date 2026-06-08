import { getPersistedDraftById } from "@/lib/drafts/drafts-repository";
import {
  createPersistedScheduledPublication,
} from "@/lib/publications/publications-repository";
import { schedulePublicationRequestSchema } from "@/lib/publications/schedule-publication-contract";

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

  const parsedRequest = schedulePublicationRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const draft = getPersistedDraftById(parsedRequest.data.draftId);

  if (!draft) {
    return Response.json(
      {
        error: "draft_not_found",
        message: "Only saved SQLite drafts can be scheduled.",
      },
      { status: 404 },
    );
  }

  const publication = createPersistedScheduledPublication(
    draft,
    parsedRequest.data.scheduledFor,
  );

  return Response.json({
    publication: {
      id: publication.id,
      draftId: publication.draftId,
      title: publication.title,
      status: publication.status,
      scheduledFor: publication.scheduledFor,
      createdAt: publication.createdAt,
    },
  });
}
