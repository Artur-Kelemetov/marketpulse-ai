import { z } from "zod";

export const reviewIdeaSafetyRequestSchema = z.object({
  assetId: z.string().min(1),
  title: z.string().max(140),
  thesis: z.string().max(2000),
  whyNow: z.string().max(1600),
  riskNotes: z.string().max(1600),
  invalidationScenario: z.string().max(1000),
  disclaimer: z.string().max(1000),
});

export const safetyReviewItemSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  passed: z.boolean(),
  severity: z.enum(["info", "warning", "blocking"]),
});

export const reviewIdeaSafetyResponseSchema = z.object({
  items: z.array(safetyReviewItemSchema),
  passedCount: z.number().int().nonnegative(),
  totalCount: z.number().int().nonnegative(),
  blockingCount: z.number().int().nonnegative(),
});

export type ReviewIdeaSafetyRequest = z.infer<
  typeof reviewIdeaSafetyRequestSchema
>;
export type SafetyReviewItem = z.infer<typeof safetyReviewItemSchema>;
export type ReviewIdeaSafetyResponse = z.infer<
  typeof reviewIdeaSafetyResponseSchema
>;
