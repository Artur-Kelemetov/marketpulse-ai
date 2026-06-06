import type { AssetType } from "@/lib/domain/market-idea";

export type MockAsset = {
  id: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  assetType: AssetType;
  exchange: string;
  currency: string;
  active: boolean;
  price: number;
  changePercent24h: number;
  volume24h: number;
  marketMood: "bullish" | "bearish" | "neutral" | "volatile" | "uncertain";
};

export const mockAssets: MockAsset[] = [
  {
    id: "asset_btc",
    symbol: "BTC",
    displaySymbol: "BTC/USD",
    name: "Bitcoin",
    assetType: "crypto",
    exchange: "binance",
    currency: "USD",
    active: true,
    price: 68420,
    changePercent24h: 2.8,
    volume24h: 38200000000,
    marketMood: "bullish",
  },
  {
    id: "asset_eth",
    symbol: "ETH",
    displaySymbol: "ETH/USD",
    name: "Ethereum",
    assetType: "crypto",
    exchange: "binance",
    currency: "USD",
    active: true,
    price: 3520,
    changePercent24h: 1.4,
    volume24h: 18400000000,
    marketMood: "neutral",
  },
  {
    id: "asset_aapl",
    symbol: "AAPL",
    displaySymbol: "AAPL",
    name: "Apple Inc.",
    assetType: "stock",
    exchange: "nasdaq",
    currency: "USD",
    active: true,
    price: 214.35,
    changePercent24h: -0.6,
    volume24h: 5220000000,
    marketMood: "neutral",
  },
  {
    id: "asset_spx",
    symbol: "SPX",
    displaySymbol: "S&P 500",
    name: "S&P 500 Index",
    assetType: "index",
    exchange: "spglobal",
    currency: "USD",
    active: true,
    price: 5478.12,
    changePercent24h: 0.5,
    volume24h: 0,
    marketMood: "bullish",
  },
  {
    id: "asset_qqq",
    symbol: "QQQ",
    displaySymbol: "QQQ",
    name: "Invesco QQQ Trust",
    assetType: "etf",
    exchange: "nasdaq",
    currency: "USD",
    active: true,
    price: 479.62,
    changePercent24h: 0.9,
    volume24h: 2240000000,
    marketMood: "bullish",
  },
];

export function getMockAssets() {
  return mockAssets;
}

export function getMockAssetById(id: string) {
  return mockAssets.find((asset) => asset.id === id) ?? null;
}

export function getMockAssetsByType(assetType: AssetType) {
  return mockAssets.filter((asset) => asset.assetType === assetType);
}
