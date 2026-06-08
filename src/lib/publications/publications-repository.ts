import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { publications, type Publication } from "@/db/schema";
import type { PersistedDraft } from "@/lib/drafts/drafts-repository";

export type PersistedScheduledPublication = Publication & {
  status: "scheduled";
};

export type PersistedPublicationLogEntry = Publication & {
  status: "sent" | "failed";
};

export function listPersistedScheduledPublications() {
  return db
    .select()
    .from(publications)
    .where(eq(publications.status, "scheduled"))
    .orderBy(asc(publications.scheduledFor))
    .all() as PersistedScheduledPublication[];
}

export function listPersistedPublicationLog() {
  return db
    .select()
    .from(publications)
    .orderBy(desc(publications.updatedAt))
    .all()
    .filter((publication) => publication.status !== "scheduled") as PersistedPublicationLogEntry[];
}

export function getPersistedPublicationById(id: string) {
  return db.select().from(publications).where(eq(publications.id, id)).get() ?? null;
}

export function createPersistedScheduledPublication(
  draft: PersistedDraft,
  scheduledFor = defaultScheduledFor(),
) {
  const now = Date.now();
  const publication = {
    id: `publication_local_${now}`,
    draftId: draft.id,
    title: draft.title,
    status: "scheduled" as const,
    scheduledFor,
    sentAt: null,
    telegramMessageId: null,
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
  };

  db.insert(publications).values(publication).run();

  return publication;
}

function defaultScheduledFor() {
  const oneHour = 60 * 60 * 1000;
  const nextHour = Date.now() + oneHour;
  const date = new Date(nextHour);

  date.setMinutes(0, 0, 0);

  return date.getTime();
}
