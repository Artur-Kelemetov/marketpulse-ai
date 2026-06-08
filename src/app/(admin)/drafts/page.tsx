import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  PenLine,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import type { DraftStatus } from "@/db/schema";
import { listPersistedDrafts } from "@/lib/drafts/drafts-repository";
import { getPersistedMarketIdeaById } from "@/lib/ideas/market-ideas-repository";
import { getMockDrafts, getMockMarketIdeaById } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const draftStatusLabels: Record<DraftStatus, string> = {
  editing: "Editing",
  needs_review: "Needs review",
  ready: "Ready",
  scheduled: "Scheduled",
};

export default function DraftsPage() {
  const persistedDrafts = listPersistedDrafts();
  const drafts = persistedDrafts.length > 0 ? persistedDrafts : getMockDrafts();
  const usingFallbackDrafts = persistedDrafts.length === 0;
  const readyCount = drafts.filter((draft) => draft.status === "ready").length;
  const reviewCount = drafts.filter(
    (draft) => draft.status === "needs_review",
  ).length;
  const blockedCount = drafts.filter((draft) => !isDraftPublishable(draft)).length;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Drafts"
        description="Editable Telegram post drafts with safety state, linked market ideas, and publication readiness."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total drafts"
            value={drafts.length.toString()}
            helper={usingFallbackDrafts ? "Mock editorial queue" : "SQLite editorial queue"}
            icon={<FileText className="size-4" />}
          />
          <SummaryCard
            label="Ready"
            value={readyCount.toString()}
            helper="Can move toward scheduling"
            icon={<CheckCircle2 className="size-4" />}
          />
          <SummaryCard
            label="Needs review"
            value={reviewCount.toString()}
            helper="Requires editorial pass"
            icon={<PenLine className="size-4" />}
          />
          <SummaryCard
            label="Blocked"
            value={blockedCount.toString()}
            helper="Missing required safety fields"
            icon={<AlertTriangle className="size-4" />}
          />
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">Draft queue</h2>
            <p className="text-sm text-muted-foreground">
              Review draft readiness before previewing or scheduling a Telegram publication.
            </p>
          </div>

          <div className="divide-y divide-border">
            {drafts.map((draft) => {
              const linkedIdea =
                getPersistedMarketIdeaById(draft.ideaId) ??
                getMockMarketIdeaById(draft.ideaId);
              const publishable = isDraftPublishable(draft);

              return (
                <article key={draft.id} className="p-4 transition-colors hover:bg-muted/30">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={draft.status === "ready" ? "good" : "neutral"}>
                          {draftStatusLabels[draft.status]}
                        </Badge>
                        <Badge tone={publishable ? "good" : "bad"}>
                          {publishable ? "Safety passed" : "Safety blocked"}
                        </Badge>
                      </div>

                      <div>
                        <Link
                          href={`/drafts/${draft.id}`}
                          className="text-base font-semibold leading-6 hover:underline"
                        >
                          {draft.title}
                        </Link>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                          {draft.telegramText}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <SafetyFlag label="Disclaimer" passed={draft.hasDisclaimer} />
                        <SafetyFlag label="Risk notes" passed={draft.hasRiskNotes} />
                        <SafetyFlag
                          label="Invalidation"
                          passed={draft.hasInvalidationScenario}
                        />
                      </div>
                    </div>

                    <div className="grid min-w-64 gap-2 text-sm text-muted-foreground">
                      <QueueFact
                        label="Updated"
                        value={dateTimeFormatter.format(new Date(draft.updatedAt))}
                      />
                      <QueueFact label="Draft id" value={draft.id} />
                      {linkedIdea ? (
                        <Link
                          href={`/ideas/${linkedIdea.id}`}
                          className="inline-flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          Linked idea
                          <ArrowUpRight className="size-4" />
                        </Link>
                      ) : (
                        <QueueFact label="Linked idea" value="Missing" />
                      )}
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

type DraftSafetyShape = {
  hasDisclaimer: boolean;
  hasRiskNotes: boolean;
  hasInvalidationScenario: boolean;
};

function isDraftPublishable(draft: DraftSafetyShape) {
  return (
    draft.hasDisclaimer && draft.hasRiskNotes && draft.hasInvalidationScenario
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
  tone: "good" | "bad" | "neutral";
};

function Badge({ children, tone }: BadgeProps) {
  const toneClassName = {
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bad: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-border bg-muted text-muted-foreground",
  }[tone];

  return (
    <span
      className={`inline-flex w-fit rounded-md border px-2 py-1 text-xs font-medium ${toneClassName}`}
    >
      {children}
    </span>
  );
}

type SafetyFlagProps = {
  label: string;
  passed: boolean;
};

function SafetyFlag({ label, passed }: SafetyFlagProps) {
  return (
    <span
      className={
        passed
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-medium text-emerald-700"
          : "rounded-md border border-red-200 bg-red-50 px-2 py-1 font-medium text-red-700"
      }
    >
      {label}: {passed ? "ok" : "missing"}
    </span>
  );
}

type QueueFactProps = {
  label: string;
  value: string;
};

function QueueFact({ label, value }: QueueFactProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-3 py-2">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

