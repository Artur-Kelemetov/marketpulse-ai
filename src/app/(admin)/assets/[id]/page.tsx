import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  getMockAssetById,
  getMockAssets,
  getMockMarketIdeaByAssetId,
} from "@/lib/mock-data";

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

export function generateStaticParams() {
  return getMockAssets().map((asset) => ({
    id: asset.id,
  }));
}

type AssetDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssetDetailsPage({
  params,
}: AssetDetailsPageProps) {
  const { id } = await params;
  const asset = getMockAssetById(id);

  if (!asset) {
    notFound();
  }

  const relatedIdeas = getMockMarketIdeaByAssetId(asset.id);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title={asset.displaySymbol}
        description={`${asset.name} · ${asset.assetType} · ${asset.exchange}`}
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <Link
          href="/assets"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to assets
        </Link>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard
            label="Price"
            value={priceFormatter.format(asset.price)}
            helper={asset.currency}
            icon={<TrendingUp className="size-4" />}
          />
          <SnapshotCard
            label="24h change"
            value={`${percentFormatter.format(asset.changePercent24h)}%`}
            helper={asset.changePercent24h >= 0 ? "Positive session" : "Negative session"}
            icon={<TrendingUp className="size-4" />}
          />
          <SnapshotCard
            label="24h volume"
            value={asset.volume24h > 0 ? compactNumberFormatter.format(asset.volume24h) : "N/A"}
            helper="Static mock value"
            icon={<CalendarClock className="size-4" />}
          />
          <SnapshotCard
            label="Market mood"
            value={asset.marketMood}
            helper="Mock sentiment label"
            icon={<ShieldAlert className="size-4" />}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-border bg-card text-card-foreground">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold">Market snapshot</h2>
              <p className="text-sm text-muted-foreground">
                Chart container placeholder for future market candles and trend context.
              </p>
            </div>
            <div className="flex min-h-72 items-center justify-center p-4">
              <div className="flex h-full min-h-60 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                TradingView Lightweight Charts will render here later.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold">Asset profile</h2>
            </div>
            <dl className="divide-y divide-border text-sm">
              <ProfileRow label="Symbol" value={asset.symbol} />
              <ProfileRow label="Display" value={asset.displaySymbol} />
              <ProfileRow label="Type" value={asset.assetType} />
              <ProfileRow label="Exchange" value={asset.exchange} />
              <ProfileRow label="Currency" value={asset.currency} />
              <ProfileRow label="Status" value={asset.active ? "active" : "inactive"} />
            </dl>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="font-semibold">Related market ideas</h2>
              <p className="text-sm text-muted-foreground">
                Ideas connected to this asset in the mock data layer.
              </p>
            </div>
            <Link
              href="/ideas/new"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              New idea
            </Link>
          </div>

          <div className="space-y-3 p-4">
            {relatedIdeas.length > 0 ? (
              relatedIdeas.map((idea) => (
                <article
                  key={idea.title}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge>{idea.suggestedAction}</Badge>
                    <Badge>{idea.conviction} conviction</Badge>
                    <Badge>{idea.status}</Badge>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium leading-6">{idea.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {idea.summary}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                No mock ideas are linked to this asset yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

type SnapshotCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

function SnapshotCard({ label, value, helper, icon }: SnapshotCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="mb-3 flex items-center justify-between gap-3 text-muted-foreground">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-normal capitalize">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}

type ProfileRowProps = {
  label: string;
  value: string;
};

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}

type BadgeProps = {
  children: React.ReactNode;
};

function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex w-fit rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

