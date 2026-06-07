import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import type {
  AssetType,
  ComplianceFlag,
  ContentType,
  Conviction,
  IdeaStatus,
  MarketMood,
  SourceMetadata,
  SuggestedAction,
  TimeHorizon,
} from "@/lib/domain/market-idea";
import type { SafetyReviewItem } from "@/lib/ai/review-idea-safety-contract";

export const assets = sqliteTable(
  "assets",
  {
    id: text("id").primaryKey(),
    symbol: text("symbol").notNull(),
    displaySymbol: text("display_symbol").notNull(),
    name: text("name").notNull(),
    assetType: text("asset_type").$type<AssetType>().notNull(),
    exchange: text("exchange").notNull(),
    currency: text("currency").notNull(),
    active: integer("active", { mode: "boolean" }).notNull(),
    price: real("price").notNull(),
    changePercent24h: real("change_percent_24h").notNull(),
    volume24h: real("volume_24h").notNull(),
    marketMood: text("market_mood").$type<MarketMood>().notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    index("assets_symbol_idx").on(table.symbol),
    index("assets_asset_type_idx").on(table.assetType),
  ],
);

export const marketIdeas = sqliteTable(
  "market_ideas",
  {
    id: text("id").primaryKey(),
    contentType: text("content_type").$type<ContentType>().notNull(),
    suggestedAction: text("suggested_action")
      .$type<SuggestedAction>()
      .notNull(),
    conviction: text("conviction").$type<Conviction>().notNull(),
    timeHorizon: text("time_horizon").$type<TimeHorizon>().notNull(),
    marketMood: text("market_mood").$type<MarketMood>().notNull(),
    status: text("status").$type<IdeaStatus>().notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    thesis: text("thesis").notNull(),
    whyNow: text("why_now", { mode: "json" }).$type<string[]>().notNull(),
    keyFactors: text("key_factors", { mode: "json" })
      .$type<string[]>()
      .notNull(),
    riskNotes: text("risk_notes", { mode: "json" })
      .$type<string[]>()
      .notNull(),
    invalidationScenario: text("invalidation_scenario").notNull(),
    educationalContext: text("educational_context"),
    disclaimer: text("disclaimer").notNull(),
    sources: text("sources", { mode: "json" })
      .$type<SourceMetadata[]>()
      .notNull(),
    metadata: text("metadata", { mode: "json" })
      .$type<Record<string, unknown>>()
      .notNull(),
    complianceFlags: text("compliance_flags", { mode: "json" })
      .$type<ComplianceFlag[]>()
      .notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    index("market_ideas_status_idx").on(table.status),
    index("market_ideas_content_type_idx").on(table.contentType),
    index("market_ideas_created_at_idx").on(table.createdAt),
  ],
);

export const marketIdeaAssets = sqliteTable(
  "market_idea_assets",
  {
    ideaId: text("idea_id")
      .notNull()
      .references(() => marketIdeas.id, { onDelete: "cascade" }),
    assetId: text("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.ideaId, table.assetId] }),
    index("market_idea_assets_asset_id_idx").on(table.assetId),
  ],
);

export const safetyReviews = sqliteTable(
  "safety_reviews",
  {
    id: text("id").primaryKey(),
    ideaId: text("idea_id")
      .notNull()
      .references(() => marketIdeas.id, { onDelete: "cascade" }),
    passedCount: integer("passed_count").notNull(),
    totalCount: integer("total_count").notNull(),
    blockingCount: integer("blocking_count").notNull(),
    items: text("items", { mode: "json" })
      .$type<SafetyReviewItem[]>()
      .notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("safety_reviews_idea_id_idx").on(table.ideaId),
    index("safety_reviews_created_at_idx").on(table.createdAt),
  ],
);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type MarketIdea = typeof marketIdeas.$inferSelect;
export type NewMarketIdea = typeof marketIdeas.$inferInsert;
export type MarketIdeaAsset = typeof marketIdeaAssets.$inferSelect;
export type NewMarketIdeaAsset = typeof marketIdeaAssets.$inferInsert;
export type SafetyReview = typeof safetyReviews.$inferSelect;
export type NewSafetyReview = typeof safetyReviews.$inferInsert;
