import { z } from "zod";

export const schedulePublicationRequestSchema = z.object({
  draftId: z.string().min(1),
  scheduledFor: z.number().int().nonnegative().optional(),
});

export const schedulePublicationResponseSchema = z.object({
  publication: z.object({
    id: z.string().min(1),
    draftId: z.string().min(1),
    title: z.string().min(1),
    status: z.literal("scheduled"),
    scheduledFor: z.number().int().nonnegative(),
    createdAt: z.number().int().nonnegative(),
  }),
});

export type SchedulePublicationRequest = z.infer<
  typeof schedulePublicationRequestSchema
>;
export type SchedulePublicationResponse = z.infer<
  typeof schedulePublicationResponseSchema
>;
