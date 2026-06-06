import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileText,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import type { IdeaStatus } from "@/lib/domain/market-idea";
import { getMockAssets, getMockMarketIdeas } from "@/lib/mock-data";

const statusLabels: Record<IdeaStatus, string> = {
  draft: "Draft",
  needs_review: "Needs review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  rejected: "Rejected",
};

export default function IdeasPage() {
  const ideas = getMockMarketIdeas();
  const assets = getMockAssets();
  const assetLookup = new Map(
    assets.map((asset) => [asset.id, asset.displaySymbol]),
  );
  const draftCount = ideas.filter((idea) => idea.status === "draft").length;
  const reviewCount = ideas.filter(
    (idea) => idea.status === "needs_review",
  ).length;
  const approvedCount = ideas.filter(
    (idea) => idea.status === "approved",
  ).length;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Market Ideas"
        description="Generated and editorial market ideas with status, conviction, related assets, and safety readiness."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total ideas"
            value={ideas.length.toString()}
            helper="Mock editorial pipeline"
            icon={<Bot className="size-4" />}
          />
          <SummaryCard
            label="Drafts"
            value={draftCount.toString()}
            helper="Needs human editing"
            icon={<FileText className="size-4" />}
          />
          <SummaryCard
            label="Needs review"
            value={reviewCount.toString()}
            helper="Safety checks pending"
            icon={<ShieldAlert className="size-4" />}
          />
          <SummaryCard
            label="Approved"
            value={approvedCount.toString()}
            helper="Ready for draft flow"
            icon={<CheckCircle2 className="size-4" />}
          />
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">Ideas pipeline</h2>
              <p className="text-sm text-muted-foreground">
                Review suggested action, conviction, risk coverage, and related assets before moving ideas into drafts.
              </p>
            </div>
            <Link
              href="/ideas/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Generate idea
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {ideas.map((idea) => {
              const relatedAssets = idea.assetIds.map(
                (assetId) => assetLookup.get(assetId) ?? assetId,
              );

              return (
                <article key={idea.id} className="p-4 transition-colors hover:bg-muted/30">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">{idea.suggestedAction}</Badge>
                        <Badge tone={idea.conviction === "high" ? "good" : "neutral"}>
                          {idea.conviction} conviction
                        </Badge>
                        <Badge tone={idea.status === "needs_review" ? "warning" : "neutral"}>
                          {statusLabels[idea.status]}
                        </Badge>
                      </div>

                      <div>
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="text-base font-semibold leading-6 hover:underline"
                        >
                          {idea.title}
                        </Link>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                          {idea.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {relatedAssets.map((asset) => (
                          <span
                            key={asset}
                            className="rounded-md border border-border bg-background px-2 py-1"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid min-w-48 gap-2 text-sm text-muted-foreground">
                      <PipelineFact label="Content" value={idea.contentType} />
                      <PipelineFact label="Horizon" value={idea.timeHorizon} />
                      <PipelineFact label="Mood" value={idea.marketMood} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

function SummaryCard({ label, value, helper, icon }: SummaryCardProps) {
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

type BadgeProps = {
  children: React.ReactNode;
  tone: "good" | "neutral" | "warning";
};

function Badge({ children, tone }: BadgeProps) {
  const toneClassName = {
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-border bg-muted text-muted-foreground",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone];

  return (
    <span
      className={`inline-flex w-fit rounded-md border px-2 py-1 text-xs font-medium ${toneClassName}`}
    >
      {children}
    </span>
  );
}

type PipelineFactProps = {
  label: string;
  value: string;
};

function PipelineFact({ label, value }: PipelineFactProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-3 py-2">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

