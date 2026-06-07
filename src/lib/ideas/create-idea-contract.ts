import { z } from "zod";

import {
  contentTypeSchema,
  convictionSchema,
  marketMoodSchema,
  suggestedActionSchema,
  timeHorizonSchema,
} from "@/lib/domain/market-idea";

export const createIdeaRequestSchema = z.object({
  assetId: z.string().min(1),
  contentType: contentTypeSchema,
  suggestedAction: suggestedActionSchema,
  conviction: convictionSchema,
  timeHorizon: timeHorizonSchema,
  marketMood: marketMoodSchema,
  title: z.string().min(1).max(140),
  thesis: z.string().min(1).max(2000),
  whyNow: z.string().min(1).max(1600),
  riskNotes: z.string().min(1).max(1600),
  invalidationScenario: z.string().min(1).max(1000),
  disclaimer: z.string().min(1).max(1000),
  authorContext: z.string().max(1200).optional(),
});

export const createIdeaResponseSchema = z.object({
  idea: z.object({
    id: z.string().min(1),
    status: z.literal("draft"),
    title: z.string().min(1),
    createdAt: z.number().int().nonnegative(),
  }),
});

export type CreateIdeaRequest = z.infer<typeof createIdeaRequestSchema>;
export type CreateIdeaResponse = z.infer<typeof createIdeaResponseSchema>;
