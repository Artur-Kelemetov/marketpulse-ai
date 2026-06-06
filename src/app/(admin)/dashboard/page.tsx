import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  getMockAssets,
  getMockPublicationLog,
  getMockRecentIdeas,
  getMockScheduledPublications,
} from "@/lib/mock-data";

const numberFormatter = new Intl.NumberFormat("en-US");
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "always",
  maximumFractionDigits: 1,
});
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function DashboardPage() {
  const assets = getMockAssets();
  const recentIdeas = getMockRecentIdeas(3);
  const scheduledPublications = getMockScheduledPublications();
  const publicationLog = getMockPublicationLog();
  const failedPublications = publicationLog.filter(
    (publication) => publication.status === "failed",
  );
  const ideasNeedingReview = recentIdeas.filter(
    (idea) => idea.status === "needs_review" || idea.status === "draft",
  );
  const bullishAssets = assets.filter(
    (asset) => asset.marketMood === "bullish",
  ).length;
  const totalVolume = assets.reduce((sum, asset) => sum + asset.volume24h, 0);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Dashboard"
        description="Working overview for market context, watchlist, recent ideas, scheduled posts, publication status, and safety warnings."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Tracked assets"
            value={numberFormatter.format(assets.length)}
            helper={`${bullishAssets} bullish, ${assets.length - bullishAssets} mixed`}
            icon={<CircleDollarSign className="size-4" />}
          />
          <MetricCard
            label="24h mock volume"
            value={compactNumberFormatter.format(totalVolume)}
            helper="Across active watchlist assets"
            icon={<ArrowUpRight className="size-4" />}
          />
          <MetricCard
            label="Recent ideas"
            value={numberFormatter.format(recentIdeas.length)}
            helper={`${ideasNeedingReview.length} waiting for review`}
            icon={<FileText className="size-4" />}
          />
          <MetricCard
            label="Scheduled posts"
            value={numberFormatter.format(scheduledPublications.length)}
            helper={`${failedPublications.length} Telegram issue in history`}
            icon={<CalendarClock className="size-4" />}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
          <Panel title="Watchlist" actionHref="/assets" actionLabel="View assets">
            <div className="divide-y divide-border">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid gap-3 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <Link
                      href={`/assets/${asset.id}`}
                      className="font-medium hover:underline"
                    >
                      {asset.displaySymbol}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {asset.name} · {asset.assetType} · {asset.exchange}
                    </p>
                  </div>
                  <div className="text-sm font-medium sm:text-right">
                    {priceFormatter.format(asset.price)}
                  </div>
                  <StatusBadge tone={asset.changePercent24h >= 0 ? "good" : "bad"}>
                    {percentFormatter.format(asset.changePercent24h)}%
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Safety warnings">
            <div className="space-y-3">
              {ideasNeedingReview.length > 0 ? (
                <WarningItem
                  title={`${ideasNeedingReview.length} ideas need editorial review`}
                  description="Draft and needs_review ideas must keep disclaimer, risk notes, and invalidation scenario before publishing."
                />
              ) : (
                <SuccessItem description="No ideas are waiting for safety review." />
              )}

              {failedPublications.length > 0 ? (
                <WarningItem
                  title={`${failedPublications.length} failed Telegram publication`}
                  description={failedPublications[0]?.errorMessage ?? "Review Telegram delivery status."}
                />
              ) : (
                <SuccessItem description="No failed Telegram publications in the mock log." />
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <Panel title="Recent market ideas" actionHref="/ideas" actionLabel="View ideas">
            <div className="space-y-3">
              {recentIdeas.map((idea) => (
                <article
                  key={idea.title}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">{idea.suggestedAction}</StatusBadge>
                    <StatusBadge tone={idea.conviction === "high" ? "good" : "neutral"}>
                      {idea.conviction} conviction
                    </StatusBadge>
                    <StatusBadge tone="neutral">{idea.status}</StatusBadge>
                  </div>
                  <h3 className="font-medium leading-6">{idea.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {idea.summary}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            title="Upcoming publications"
            actionHref="/calendar"
            actionLabel="View calendar"
          >
            <div className="space-y-3">
              {scheduledPublications.map((publication) => (
                <article
                  key={publication.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <StatusBadge tone="neutral">{publication.status}</StatusBadge>
                    <time className="text-xs text-muted-foreground">
                      {dateTimeFormatter.format(new Date(publication.scheduledFor))}
                    </time>
                  </div>
                  <h3 className="font-medium leading-6">{publication.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Draft: {publication.draftId}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

function MetricCard({ label, value, helper, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="mb-3 flex items-center justify-between gap-3 text-muted-foreground">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-normal">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}

type PanelProps = {
  title: string;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
};

function Panel({ title, children, actionHref, actionLabel }: PanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

type StatusBadgeProps = {
  children: React.ReactNode;
  tone: "good" | "bad" | "neutral";
};

function StatusBadge({ children, tone }: StatusBadgeProps) {
  const toneClassName = {
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bad: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-border bg-muted text-muted-foreground",
  }[tone];

  return (
    <span
      className={`inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs font-medium ${toneClassName}`}
    >
      {children}
    </span>
  );
}

type WarningItemProps = {
  title: string;
  description: string;
};

function WarningItem({ title, description }: WarningItemProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}

type SuccessItemProps = {
  description: string;
};

function SuccessItem({ description }: SuccessItemProps) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        <p className="text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}


