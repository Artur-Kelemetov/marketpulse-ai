import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  assets,
  marketIdeaAssets,
  marketIdeas,
  type MarketIdea,
} from "@/db/schema";
import type { GeneratedMarketIdea } from "@/lib/domain/market-idea";
import type { CreateIdeaRequest } from "@/lib/ideas/create-idea-contract";
import type { MockAsset } from "@/lib/mock-data";

export type PersistedMarketIdea = GeneratedMarketIdea & {
  id: string;
  assetIds: string[];
  createdAt: number;
  updatedAt: number;
};

export function listPersistedMarketIdeas() {
  const rows = db
    .select()
    .from(marketIdeas)
    .orderBy(desc(marketIdeas.createdAt))
    .all();

  return rows.map((idea) => mapMarketIdeaRow(idea));
}

export function getPersistedMarketIdeaById(id: string) {
  const idea = db
    .select()
    .from(marketIdeas)
    .where(eq(marketIdeas.id, id))
    .get();

  return idea ? mapMarketIdeaRow(idea) : null;
}

export function createPersistedMarketIdea(
  input: CreateIdeaRequest,
  asset: MockAsset,
) {
  const now = Date.now();
  const id = `idea_local_${now}`;
  const whyNow = splitTextBlock(input.whyNow);
  const riskNotes = splitTextBlock(input.riskNotes);
  const summary = buildSummary(input.thesis);

  db.transaction(() => {
    db.insert(assets)
      .values({
        id: asset.id,
        symbol: asset.symbol,
        displaySymbol: asset.displaySymbol,
        name: asset.name,
        assetType: asset.assetType,
        exchange: asset.exchange,
        currency: asset.currency,
        active: asset.active,
        price: asset.price,
        changePercent24h: asset.changePercent24h,
        volume24h: asset.volume24h,
        marketMood: asset.marketMood,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: assets.id,
        set: {
          symbol: asset.symbol,
          displaySymbol: asset.displaySymbol,
          name: asset.name,
          assetType: asset.assetType,
          exchange: asset.exchange,
          currency: asset.currency,
          active: asset.active,
          price: asset.price,
          changePercent24h: asset.changePercent24h,
          volume24h: asset.volume24h,
          marketMood: asset.marketMood,
          updatedAt: now,
        },
      })
      .run();

    db.insert(marketIdeas)
      .values({
        id,
        contentType: input.contentType,
        suggestedAction: input.suggestedAction,
        conviction: input.conviction,
        timeHorizon: input.timeHorizon,
        marketMood: input.marketMood,
        status: "draft",
        title: input.title,
        summary,
        thesis: input.thesis,
        whyNow,
        keyFactors: buildKeyFactors(input),
        riskNotes,
        invalidationScenario: input.invalidationScenario,
        educationalContext: input.authorContext?.trim() || null,
        disclaimer: input.disclaimer,
        sources: [],
        metadata: {
          source: "new_idea_form",
          generatedAt: now,
        },
        complianceFlags: [],
        createdAt: now,
        updatedAt: now,
      })
      .run();

    db.insert(marketIdeaAssets)
      .values({
        ideaId: id,
        assetId: asset.id,
      })
      .run();
  });

  return {
    id,
    status: "draft" as const,
    title: input.title,
    createdAt: now,
  };
}

function mapMarketIdeaRow(idea: MarketIdea): PersistedMarketIdea {
  const assetLinks = db
    .select({ assetId: marketIdeaAssets.assetId })
    .from(marketIdeaAssets)
    .where(eq(marketIdeaAssets.ideaId, idea.id))
    .all();

  return {
    id: idea.id,
    assetIds: assetLinks.map((assetLink) => assetLink.assetId),
    contentType: idea.contentType,
    suggestedAction: idea.suggestedAction,
    conviction: idea.conviction,
    timeHorizon: idea.timeHorizon,
    marketMood: idea.marketMood,
    title: idea.title,
    summary: idea.summary,
    thesis: idea.thesis,
    whyNow: idea.whyNow,
    keyFactors: idea.keyFactors,
    riskNotes: idea.riskNotes,
    invalidationScenario: idea.invalidationScenario,
    educationalContext: idea.educationalContext ?? undefined,
    disclaimer: idea.disclaimer,
    sources: idea.sources,
    metadata: idea.metadata,
    complianceFlags: idea.complianceFlags,
    status: idea.status,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
  };
}

function splitTextBlock(value: string) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : [value.trim()];
}

function buildSummary(thesis: string) {
  const firstSentence = thesis.split(/(?<=[.!?])\s+/)[0]?.trim() || thesis.trim();

  return firstSentence.length > 280
    ? `${firstSentence.slice(0, 277).trim()}...`
    : firstSentence;
}

function buildKeyFactors(input: CreateIdeaRequest) {
  return [
    `${input.suggestedAction} action`,
    `${input.conviction} conviction`,
    `${input.marketMood} market mood`,
    `${input.timeHorizon} horizon`,
  ];
}

