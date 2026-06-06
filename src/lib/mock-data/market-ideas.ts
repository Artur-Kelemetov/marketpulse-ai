import type { GeneratedMarketIdea } from "@/lib/domain/market-idea";

export type MockMarketIdea = GeneratedMarketIdea & {
  id: string;
};

export const informationalDisclaimer =
  "This content is for informational and educational purposes only and is not financial advice.";

export const mockMarketIdeas: MockMarketIdea[] = [
  {
    id: "idea_btc_breakout",
    contentType: "trade_idea",
    assetIds: ["asset_btc"],
    suggestedAction: "buy",
    conviction: "high",
    timeHorizon: "swing",
    marketMood: "bullish",
    title: "BTC holds the breakout zone as risk appetite improves",
    summary:
      "BTC remains a strong buy thesis while price holds above the recent breakout area and broader risk appetite stays constructive.",
    thesis:
      "The idea favors BTC because price structure remains constructive, ETF-related narratives continue to support demand, and crypto breadth has improved without removing volatility risk.",
    whyNow: [
      "BTC is holding above a recent breakout area.",
      "Risk appetite has improved across crypto and growth assets.",
      "The market has a clear invalidation zone if momentum fades.",
    ],
    keyFactors: [
      "Positive trend structure",
      "Supportive ETF flow narrative",
      "Improving crypto market breadth",
    ],
    riskNotes: [
      "Crypto volatility can trigger sharp reversals.",
      "A broad risk-off move would weaken the setup.",
    ],
    invalidationScenario:
      "The thesis weakens if BTC loses the breakout area and fails to reclaim it quickly.",
    educationalContext:
      "A buy thesis is a market scenario, not a guarantee of price movement.",
    disclaimer: informationalDisclaimer,
    sources: [],
    metadata: {
      model: "mock",
      generatedAt: 1734568000000,
    },
    complianceFlags: [],
    status: "draft",
  },
  {
    id: "idea_aapl_confirmation",
    contentType: "asset_analysis",
    assetIds: ["asset_aapl"],
    suggestedAction: "watch",
    conviction: "medium",
    timeHorizon: "swing",
    marketMood: "neutral",
    title: "AAPL needs confirmation before the next directional call",
    summary:
      "AAPL is a watch idea until price confirms renewed strength or breaks below the current consolidation range.",
    thesis:
      "The stock remains high quality, but the current market context favors patience because momentum is mixed and leadership is rotating across mega-cap technology.",
    whyNow: [
      "The stock is consolidating after a strong move.",
      "Mega-cap technology leadership has become more selective.",
      "A clearer breakout or breakdown would improve the quality of the call.",
    ],
    keyFactors: [
      "Mixed momentum",
      "Strong brand and cash generation",
      "Rotation risk inside large-cap technology",
    ],
    riskNotes: [
      "A failed breakout could pressure the stock.",
      "Index-level weakness can override company-specific strength.",
    ],
    invalidationScenario:
      "The watch thesis changes if AAPL breaks the consolidation range with strong volume in either direction.",
    educationalContext:
      "A watch stance can be useful when the market has not yet confirmed direction.",
    disclaimer: informationalDisclaimer,
    sources: [],
    metadata: {
      model: "mock",
      generatedAt: 1734568600000,
    },
    complianceFlags: [],
    status: "needs_review",
  },
  {
    id: "idea_spx_qqq_breadth",
    contentType: "market_watchlist",
    assetIds: ["asset_spx", "asset_qqq"],
    suggestedAction: "hold",
    conviction: "medium",
    timeHorizon: "long_term",
    marketMood: "bullish",
    title: "SPX and QQQ still lean constructive, but breadth matters",
    summary:
      "The index backdrop remains constructive, although the quality of the move depends on whether participation broadens beyond the largest names.",
    thesis:
      "The hold thesis is supported by a resilient trend in broad indices, but it should be monitored for narrowing breadth and sensitivity to rates.",
    whyNow: [
      "Major indices remain near leadership zones.",
      "Risk appetite is still constructive.",
      "Breadth and rate sensitivity are the key checks for continuation.",
    ],
    keyFactors: [
      "Positive index trend",
      "Constructive risk appetite",
      "Breadth confirmation needed",
    ],
    riskNotes: [
      "A sharp rate repricing could pressure growth exposure.",
      "Narrow leadership would make the rally more fragile.",
    ],
    invalidationScenario:
      "The thesis weakens if SPX and QQQ lose trend support while breadth deteriorates.",
    disclaimer: informationalDisclaimer,
    sources: [],
    metadata: {
      model: "mock",
      generatedAt: 1734569200000,
    },
    complianceFlags: [],
    status: "approved",
  },
];

export function getMockMarketIdeas() {
  return mockMarketIdeas;
}

export function getMockMarketIdeaById(id: string) {
  return mockMarketIdeas.find((idea) => idea.id === id) ?? null;
}

export function getMockMarketIdeaByAssetId(assetId: string) {
  return mockMarketIdeas.filter((idea) => idea.assetIds.includes(assetId));
}

export function getMockRecentIdeas(limit = 5) {
  return mockMarketIdeas.slice(0, limit);
}
