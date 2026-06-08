import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { drafts, type Draft } from "@/db/schema";
import type { PersistedMarketIdea } from "@/lib/ideas/market-ideas-repository";

export type PersistedDraft = Draft & {
  updatedAt: number;
};

export function listPersistedDrafts() {
  return db.select().from(drafts).orderBy(desc(drafts.updatedAt)).all();
}

export function getPersistedDraftById(id: string) {
  return db.select().from(drafts).where(eq(drafts.id, id)).get() ?? null;
}

export function createPersistedDraftFromIdea(idea: PersistedMarketIdea) {
  const now = Date.now();
  const id = `draft_local_${now}`;
  const telegramText = buildTelegramText(idea);
  const draft = {
    id,
    ideaId: idea.id,
    title: idea.title,
    telegramText,
    status: "editing" as const,
    hasDisclaimer: Boolean(idea.disclaimer.trim()),
    hasRiskNotes: idea.riskNotes.length > 0,
    hasInvalidationScenario: Boolean(idea.invalidationScenario.trim()),
    createdAt: now,
    updatedAt: now,
  };

  db.insert(drafts).values(draft).run();

  return draft;
}

function buildTelegramText(idea: PersistedMarketIdea) {
  return [
    idea.title,
    "",
    `${idea.suggestedAction.toUpperCase()} idea · ${idea.conviction} conviction · ${idea.timeHorizon}`,
    "",
    idea.summary,
    "",
    "Why now:",
    ...idea.whyNow.map((item) => `- ${item}`),
    "",
    "Risks:",
    ...idea.riskNotes.map((item) => `- ${item}`),
    "",
    `Invalidation: ${idea.invalidationScenario}`,
    "",
    idea.disclaimer,
  ].join("\n");
}
