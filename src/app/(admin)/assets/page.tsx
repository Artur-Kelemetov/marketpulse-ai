import Link from "next/link";
import { ArrowUpRight, BarChart3, Layers3 } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import type { AssetType } from "@/lib/domain/market-idea";
import { getMockAssets } from "@/lib/mock-data";

const assetTypes: AssetType[] = ["crypto", "stock", "index", "etf"];

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "always",
  maximumFractionDigits: 1,
});
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function AssetsPage() {
  const assets = getMockAssets();
  const totalVolume = assets.reduce((sum, asset) => sum + asset.volume24h, 0);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Assets"
        description="Track crypto, stocks, indices, and ETF context before turning market observations into publishable ideas."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {assetTypes.map((assetType) => {
            const count = assets.filter(
              (asset) => asset.assetType === assetType,
            ).length;

            return (
              <div
                key={assetType}
                className="rounded-lg border border-border bg-card p-4 text-card-foreground"
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-muted-foreground">
                  <span className="text-sm font-medium capitalize">
                    {assetType}
                  </span>
                  <Layers3 className="size-4" />
                </div>
                <p className="text-2xl font-semibold tracking-normal">{count}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Active mock assets
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">Asset watchlist</h2>
              <p className="text-sm text-muted-foreground">
                {assets.length} active assets · {compactNumberFormatter.format(totalVolume)} mock 24h volume
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="size-4" />
              Prices are static mock values
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Exchange</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">24h</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                  <th className="px-4 py-3">Mood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assets.map((asset) => (
                  <tr key={asset.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="group inline-flex items-center gap-2 font-medium"
                      >
                        {asset.displaySymbol}
                        <ArrowUpRight className="size-3 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {asset.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {asset.assetType}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {asset.exchange}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {priceFormatter.format(asset.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChangeValue value={asset.changePercent24h} />
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {asset.volume24h > 0
                        ? compactNumberFormatter.format(asset.volume24h)
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <MoodBadge mood={asset.marketMood} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

type ChangeValueProps = {
  value: number;
};

function ChangeValue({ value }: ChangeValueProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={isPositive ? "font-medium text-emerald-700" : "font-medium text-red-700"}
    >
      {percentFormatter.format(value)}%
    </span>
  );
}

type MoodBadgeProps = {
  mood: string;
};

function MoodBadge({ mood }: MoodBadgeProps) {
  return (
    <span className="inline-flex w-fit rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground">
      {mood}
    </span>
  );
}
