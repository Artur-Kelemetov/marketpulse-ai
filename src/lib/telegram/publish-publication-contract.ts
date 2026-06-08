import { z } from "zod";

export const publishPublicationRequestSchema = z.object({
  publicationId: z.string().min(1),
});

export const publishPublicationResponseSchema = z.object({
  publication: z.object({
    id: z.string().min(1),
    draftId: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(["sent", "failed"]),
    sentAt: z.number().int().nonnegative().nullable(),
    telegramMessageId: z.string().nullable(),
    errorMessage: z.string().nullable(),
    updatedAt: z.number().int().nonnegative(),
  }),
});

export type PublishPublicationRequest = z.infer<
  typeof publishPublicationRequestSchema
>;
export type PublishPublicationResponse = z.infer<
  typeof publishPublicationResponseSchema
>;
