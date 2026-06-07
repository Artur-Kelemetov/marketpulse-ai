import { z } from "zod";

import {
  contentTypeSchema,
  convictionSchema,
  marketMoodSchema,
  suggestedActionSchema,
  timeHorizonSchema,
} from "@/lib/domain/market-idea";

export const generateIdeaRequestSchema = z.object({
  assetId: z.string().min(1),
  contentType: contentTypeSchema,
  suggestedAction: suggestedActionSchema,
  conviction: convictionSchema,
  timeHorizon: timeHorizonSchema,
  marketMood: marketMoodSchema,
  authorContext: z.string().max(1200).optional(),
});

export const generatedIdeaPayloadSchema = z.object({
  title: z.string().min(1),
  thesis: z.string().min(1),
  whyNow: z.string().min(1),
  riskNotes: z.string().min(1),
  invalidationScenario: z.string().min(1),
  disclaimer: z.string().min(1),
});

export const generateIdeaResponseSchema = z.object({
  idea: generatedIdeaPayloadSchema,
});

export type GenerateIdeaRequest = z.infer<typeof generateIdeaRequestSchema>;
export type GeneratedIdeaPayload = z.infer<typeof generatedIdeaPayloadSchema>;
export type GenerateIdeaResponse = z.infer<typeof generateIdeaResponseSchema>;
