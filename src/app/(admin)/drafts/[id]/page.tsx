import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Send,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import type { DraftStatus } from "@/db/schema";
import { getPersistedDraftById } from "@/lib/drafts/drafts-repository";
import { getPersistedMarketIdeaById } from "@/lib/ideas/market-ideas-repository";
import { getMockDraftById, getMockMarketIdeaById } from "@/lib/mock-data";

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

type DraftDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DraftDetailsPage({
  params,
}: DraftDetailsPageProps) {
  const { id } = await params;
  const draft = getPersistedDraftById(id) ?? getMockDraftById(id);

  if (!draft) {
    notFound();
  }

  const linkedIdea =
    getPersistedMarketIdeaById(draft.ideaId) ?? getMockMarketIdeaById(draft.ideaId);
  const safetyItems = [
    {
      label: "Disclaimer",
      description: "Required before Telegram publishing.",
      passed: draft.hasDisclaimer,
    },
    {
      label: "Risk notes",
      description: "Draft must explicitly show downside or uncertainty.",
      passed: draft.hasRiskNotes,
    },
    {
      label: "Invalidation scenario",
      description: "The idea needs a clear condition where the thesis weakens.",
      passed: draft.hasInvalidationScenario,
    },
  ];
  const publishable = safetyItems.every((item) => item.passed);
  const characterCount = draft.telegramText.length;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title={draft.title}
        description="Draft editor and Telegram preview with publication blocked until safety checks pass."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/drafts"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to drafts
          </Link>

          {linkedIdea ? (
            <Link
              href={`/ideas/${linkedIdea.id}`}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
            >
              <FileText className="size-4" />
              Linked idea
            </Link>
          ) : null}
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FactCard label="Status" value={draftStatusLabels[draft.status]} />
          <FactCard
            label="Updated"
            value={dateTimeFormatter.format(new Date(draft.updatedAt))}
          />
          <FactCard label="Characters" value={characterCount.toString()} />
          <FactCard
            label="Publish readiness"
            value={publishable ? "Ready" : "Blocked"}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-5">
            <Panel title="Telegram preview" icon={<Eye className="size-4" />}>
              <div className="rounded-lg border border-border bg-background p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {draft.telegramText}
                </pre>
              </div>
            </Panel>

            <Panel title="Source idea" icon={<FileText className="size-4" />}>
              {linkedIdea ? (
                <div>
                  <Link
                    href={`/ideas/${linkedIdea.id}`}
                    className="font-medium hover:underline"
                  >
                    {linkedIdea.title}
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {linkedIdea.summary}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked market idea was not found.
                </p>
              )}
            </Panel>
          </div>

          <aside className="flex flex-col gap-5">
            <Panel title="Safety review" icon={<ShieldAlert className="size-4" />}>
              <div className="space-y-3">
                {safetyItems.map((item) => (
                  <SafetyCheck
                    key={item.label}
                    label={item.label}
                    description={item.description}
                    passed={item.passed}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Manual approval" icon={<Send className="size-4" />}>
              <div
                className={
                  publishable
                    ? "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
                    : "rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900"
                }
              >
                <div className="flex items-start gap-3">
                  {publishable ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {publishable ? "Ready for approval" : "Publication blocked"}
                    </h3>
                    <p className="mt-1 text-sm leading-6">
                      {publishable
                        ? "This mock draft has all required safety fields. Real Telegram publishing will still require manual approval."
                        : "Restore the missing safety requirements before this draft can be published."}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </aside>
        </section>
      </div>
    </main>
  );
}

type FactCardProps = {
  label: string;
  value: string;
};

function FactCard({ label, value }: FactCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}

type PanelProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

function Panel({ title, children, icon }: PanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card text-card-foreground">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-muted-foreground">
        {icon}
        <h2 className="font-semibold text-card-foreground">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

type SafetyCheckProps = {
  label: string;
  description: string;
  passed: boolean;
};

function SafetyCheck({ label, description, passed }: SafetyCheckProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <span
          className={
            passed
              ? "rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
              : "rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
          }
        >
          {passed ? "Passed" : "Missing"}
        </span>
      </div>
    </div>
  );
}

