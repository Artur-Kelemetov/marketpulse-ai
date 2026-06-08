import { getPersistedDraftById } from "@/lib/drafts/drafts-repository";
import {
  getPersistedPublicationById,
  markPersistedPublicationFailed,
  markPersistedPublicationSent,
} from "@/lib/publications/publications-repository";
import {
  publishPublicationRequestSchema,
  type PublishPublicationResponse,
} from "@/lib/telegram/publish-publication-contract";
import {
  sendTelegramMessage,
  TelegramConfigurationError,
} from "@/lib/telegram/telegram-client";

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

  const parsedRequest = publishPublicationRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const publication = getPersistedPublicationById(
    parsedRequest.data.publicationId,
  );

  if (!publication) {
    return Response.json(
      {
        error: "publication_not_found",
        message: "Only saved SQLite publications can be published.",
      },
      { status: 404 },
    );
  }

  if (publication.status === "sent") {
    return Response.json(toPublishPublicationResponse(publication));
  }

  const draft = getPersistedDraftById(publication.draftId);

  if (!draft) {
    return Response.json(
      {
        error: "draft_not_found",
        message: "Source draft was not found.",
      },
      { status: 404 },
    );
  }

  try {
    const result = await sendTelegramMessage(draft.telegramText);
    const sentPublication = markPersistedPublicationSent(
      publication.id,
      result.messageId,
    );

    if (!sentPublication) {
      throw new Error("Published message was sent, but publication update failed.");
    }

    return Response.json(toPublishPublicationResponse(sentPublication));
  } catch (error) {
    if (error instanceof TelegramConfigurationError) {
      return Response.json(
        { error: "telegram_not_configured", message: error.message },
        { status: 400 },
      );
    }

    const failedPublication = markPersistedPublicationFailed(
      publication.id,
      getErrorMessage(error),
    );

    if (!failedPublication) {
      return Response.json(
        {
          error: "publication_update_failed",
          message: "Telegram publish failed and status update failed.",
        },
        { status: 500 },
      );
    }

    return Response.json(toPublishPublicationResponse(failedPublication));
  }
}

type PublishablePublication = NonNullable<
  ReturnType<typeof getPersistedPublicationById>
>;

function toPublishPublicationResponse(
  publication: PublishablePublication,
): PublishPublicationResponse {
  return {
    publication: {
      id: publication.id,
      draftId: publication.draftId,
      title: publication.title,
      status: publication.status === "scheduled" ? "failed" : publication.status,
      sentAt: publication.sentAt,
      telegramMessageId: publication.telegramMessageId,
      errorMessage: publication.errorMessage,
      updatedAt: publication.updatedAt,
    },
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Telegram publish failed.";
}