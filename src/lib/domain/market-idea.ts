import { z } from "zod";

export const assetTypeSchema = z.enum(["crypto", "stock", "index", "etf"]);

export const contentTypeSchema = z.enum([
  "daily_market_brief",
  "asset_analysis",
  "weekly_digest",
  "educational_post",
  "news_reaction",
  "risk_warning",
  "trade_idea",
  "market_watchlist",
]);

export const suggestedActionSchema = z.enum(["buy", "sell", "hold", "watch"]);

export const convictionSchema = z.enum(["low", "medium", "high"]);

export const timeHorizonSchema = z.enum([
  "intraday",
  "swing",
  "long_term",
  "unknown",
]);

export const marketMoodSchema = z.enum([
  "bullish",
  "bearish",
  "neutral",
  "volatile",
  "uncertain",
]);

export const ideaStatusSchema = z.enum([
  "draft",
  "needs_review",
  "approved",
  "scheduled",
  "published",
  "rejected",
]);

export const sourceMetadataSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  publisher: z.string().optional(),
  publishedAt: z.number().int().nonnegative().optional(),
  accessedAt: z.number().int().nonnegative().optional(),
});

export const complianceFlagSchema = z.object({
  code: z.enum([
    "missing_disclaimer",
    "promises_profit",
    "overconfident_language",
    "personalized_advice_risk",
    "missing_risk_notes",
    "missing_invalidation_scenario",
    "unsupported_claim",
  ]),
  severity: z.enum(["info", "warning", "blocking"]),
  message: z.string().min(1),
});

export const generatedMarketIdeaSchema = z
  .object({
    contentType: contentTypeSchema,
    assetIds: z.array(z.string().min(1)).min(1),
    suggestedAction: suggestedActionSchema,
    conviction: convictionSchema,
    timeHorizon: timeHorizonSchema,
    marketMood: marketMoodSchema,
    title: z.string().min(1).max(140),
    summary: z.string().min(1).max(600),
    thesis: z.string().min(1).max(2000),
    whyNow: z.array(z.string().min(1)).min(1).max(8),
    keyFactors: z.array(z.string().min(1)).min(1).max(10),
    riskNotes: z.array(z.string().min(1)).min(1).max(10),
    invalidationScenario: z.string().min(1).max(1000),
    educationalContext: z.string().max(1200).optional(),
    disclaimer: z.string().min(1),
    sources: z.array(sourceMetadataSchema).default([]),
    metadata: z.record(z.string(), z.unknown()).default({}),
    complianceFlags: z.array(complianceFlagSchema).default([]),
    status: ideaStatusSchema.default("draft"),
  })
  .superRefine((value, ctx) => {
    const disclaimer = value.disclaimer.toLowerCase();
    const hasDisclaimer =
      disclaimer.includes("not financial advice") ||
      disclaimer.includes("\u043d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f") ||
      disclaimer.includes(
        "\u0444\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u043e\u0439 \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0435\u0439",
      );

    if (!hasDisclaimer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["disclaimer"],
        message: "Market idea must include a clear financial disclaimer.",
      });
    }

    if (value.riskNotes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["riskNotes"],
        message: "Market idea must include at least one risk note.",
      });
    }

    if (!value.invalidationScenario.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["invalidationScenario"],
        message: "Market idea must include an invalidation scenario.",
      });
    }
  });

export type AssetType = z.infer<typeof assetTypeSchema>;
export type ContentType = z.infer<typeof contentTypeSchema>;
export type SuggestedAction = z.infer<typeof suggestedActionSchema>;
export type Conviction = z.infer<typeof convictionSchema>;
export type TimeHorizon = z.infer<typeof timeHorizonSchema>;
export type MarketMood = z.infer<typeof marketMoodSchema>;
export type IdeaStatus = z.infer<typeof ideaStatusSchema>;
export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;
export type ComplianceFlag = z.infer<typeof complianceFlagSchema>;
export type GeneratedMarketIdea = z.infer<typeof generatedMarketIdeaSchema>;
