import { z } from "zod";

export const createDraftRequestSchema = z.object({
  ideaId: z.string().min(1),
});

export const createDraftResponseSchema = z.object({
  draft: z.object({
    id: z.string().min(1),
    ideaId: z.string().min(1),
    title: z.string().min(1),
    status: z.literal("editing"),
    createdAt: z.number().int().nonnegative(),
  }),
});

export type CreateDraftRequest = z.infer<typeof createDraftRequestSchema>;
export type CreateDraftResponse = z.infer<typeof createDraftResponseSchema>;
