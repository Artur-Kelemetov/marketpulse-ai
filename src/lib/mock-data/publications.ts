export type MockPublicationStatus = "scheduled" | "sent" | "failed";

export type MockScheduledPublication = {
  id: string;
  draftId: string;
  title: string;
  scheduledFor: string;
  status: Extract<MockPublicationStatus, "scheduled">;
};

export type MockPublicationLogEntry = {
  id: string;
  draftId: string;
  title: string;
  sentAt: string;
  status: Exclude<MockPublicationStatus, "scheduled">;
  telegramMessageId?: string;
  errorMessage?: string;
};

export const mockScheduledPublications: MockScheduledPublication[] = [
  {
    id: "schedule_btc_swing",
    draftId: "draft_btc_swing",
    title: "BTC holds the breakout zone as risk appetite improves",
    scheduledFor: "2026-06-06T18:00:00.000Z",
    status: "scheduled",
  },
  {
    id: "schedule_spx_watchlist",
    draftId: "draft_spx_watchlist",
    title: "SPX and QQQ still lean constructive, but breadth matters",
    scheduledFor: "2026-06-07T09:30:00.000Z",
    status: "scheduled",
  },
];

export const mockPublicationLog: MockPublicationLogEntry[] = [
  {
    id: "publication_eth_rotation",
    draftId: "draft_eth_rotation",
    title: "ETH waits for stronger relative strength confirmation",
    sentAt: "2026-06-05T16:20:00.000Z",
    status: "sent",
    telegramMessageId: "241",
  },
  {
    id: "publication_aapl_watch",
    draftId: "draft_aapl_watch",
    title: "AAPL needs confirmation before the next directional call",
    sentAt: "2026-06-05T12:00:00.000Z",
    status: "failed",
    errorMessage: "Telegram Bot API returned a temporary rate limit error.",
  },
];

export function getMockScheduledPublications() {
  return mockScheduledPublications;
}

export function getMockPublicationLog() {
  return mockPublicationLog;
}
