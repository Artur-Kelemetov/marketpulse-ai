export type MockDraftStatus = "editing" | "needs_review" | "ready" | "scheduled";

export type MockDraft = {
  id: string;
  ideaId: string;
  title: string;
  telegramText: string;
  status: MockDraftStatus;
  hasDisclaimer: boolean;
  hasRiskNotes: boolean;
  hasInvalidationScenario: boolean;
  updatedAt: string;
};

export const mockDrafts: MockDraft[] = [
  {
    id: "draft_btc_swing",
    ideaId: "idea_btc_breakout",
    title: "BTC holds the breakout zone as risk appetite improves",
    telegramText:
      "BTC remains a strong buy idea while price holds above the recent breakout area. Risk appetite has improved, ETF-related narratives remain supportive, and the invalidation is clear: the thesis weakens if BTC loses the breakout area and fails to reclaim it quickly. This content is for informational and educational purposes only and is not financial advice.",
    status: "editing",
    hasDisclaimer: true,
    hasRiskNotes: true,
    hasInvalidationScenario: true,
    updatedAt: "2026-06-06T15:40:00.000Z",
  },
  {
    id: "draft_aapl_watch",
    ideaId: "idea_aapl_confirmation",
    title: "AAPL needs confirmation before the next directional call",
    telegramText:
      "AAPL is a watch idea while the stock consolidates. The setup needs confirmation from either a clean breakout or a breakdown below the current range before taking a stronger directional stance.",
    status: "needs_review",
    hasDisclaimer: false,
    hasRiskNotes: true,
    hasInvalidationScenario: true,
    updatedAt: "2026-06-06T13:15:00.000Z",
  },
  {
    id: "draft_spx_watchlist",
    ideaId: "idea_spx_qqq_breadth",
    title: "SPX and QQQ still lean constructive, but breadth matters",
    telegramText:
      "SPX and QQQ still lean constructive while the index trend remains resilient. The key risk is narrow leadership: if breadth deteriorates while rates reprice higher, the thesis weakens. This content is for informational and educational purposes only and is not financial advice.",
    status: "ready",
    hasDisclaimer: true,
    hasRiskNotes: true,
    hasInvalidationScenario: true,
    updatedAt: "2026-06-06T10:05:00.000Z",
  },
];

export function getMockDrafts() {
  return mockDrafts;
}

export function getMockDraftById(id: string) {
  return mockDrafts.find((draft) => draft.id === id) ?? null;
}

export function getMockDraftsByIdeaId(ideaId: string) {
  return mockDrafts.filter((draft) => draft.ideaId === ideaId);
}
