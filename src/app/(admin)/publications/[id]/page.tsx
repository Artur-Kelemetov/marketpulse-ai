import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { getPersistedDraftById } from "@/lib/drafts/drafts-repository";
import { getPersistedPublicationById } from "@/lib/publications/publications-repository";
import {
  getMockDraftById,
  getMockPublicationById,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type PublicationDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicationDetailsPage({
  params,
}: PublicationDetailsPageProps) {
  const { id } = await params;
  const publication =
    getPersistedPublicationById(id) ?? getMockPublicationById(id);

  if (!publication) {
    notFound();
  }

  const draft =
    getPersistedDraftById(publication.draftId) ?? getMockDraftById(publication.draftId);
  const isSent = publication.status === "sent";
  const isScheduled = publication.status === "scheduled";
  const publicationTime = getPublicationTime(publication);
  const safetyItems = draft
    ? [
        {
          label: "Disclaimer",
          passed: draft.hasDisclaimer,
        },
        {
          label: "Risk notes",
          passed: draft.hasRiskNotes,
        },
        {
          label: "Invalidation scenario",
          passed: draft.hasInvalidationScenario,
        },
      ]
    : [];

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title={publication.title}
        description="Single publication audit record with schedule, Telegram result, draft source, and safety metadata."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/publications"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to publications
          </Link>

          {draft ? (
            <Link
              href={`/drafts/${draft.id}`}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
            >
              <FileText className="size-4" />
              Source draft
            </Link>
          ) : null}
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FactCard
            label="Status"
            value={isScheduled ? "Scheduled" : isSent ? "Sent" : "Failed"}
          />
          <FactCard
            label={isScheduled ? "Scheduled for" : "Sent at"}
            value={dateTimeFormatter.format(new Date(publicationTime))}
          />
          <FactCard
            label="Telegram id"
            value={publication.telegramMessageId ?? "N/A"}
          />
          <FactCard label="Draft" value={publication.draftId} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-5">
            <Panel
              title="Telegram result"
              icon={
                isSent || isScheduled ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <AlertTriangle className="size-4" />
                )
              }
            >
              <div
                className={
                  isSent || isScheduled
                    ? "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
                    : "rounded-lg border border-red-200 bg-red-50 p-4 text-red-900"
                }
              >
                <h3 className="font-medium">
                  {isScheduled ? "Publication scheduled" : isSent ? "Message delivered" : "Delivery failed"}
                </h3>
                <p className="mt-2 text-sm leading-6">
                  {isScheduled
                    ? `This draft is scheduled for ${dateTimeFormatter.format(new Date(publicationTime))}.`
                    : isSent
                      ? `Telegram Bot API accepted the message and returned message id ${publication.telegramMessageId}.`
                      : publication.errorMessage}
                </p>
              </div>
            </Panel>

            <Panel title="Source draft preview" icon={<MessageSquare className="size-4" />}>
              {draft ? (
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
                  {draft.telegramText}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Source draft was not found.
                </p>
              )}
            </Panel>
          </div>

          <aside className="flex flex-col gap-5">
            <Panel title="Audit summary" icon={<ShieldAlert className="size-4" />}>
              <div className="space-y-3">
                <AuditRow label="Publication id" value={publication.id} />
                <AuditRow label="Draft id" value={publication.draftId} />
                <AuditRow label="Status" value={publication.status} />
                {publication.telegramMessageId ? (
                  <AuditRow
                    label="Telegram message"
                    value={publication.telegramMessageId}
                  />
                ) : null}
              </div>
            </Panel>

            <Panel title="Safety snapshot" icon={<ShieldAlert className="size-4" />}>
              {draft ? (
                <div className="space-y-3">
                  {safetyItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <span>{item.label}</span>
                      <span
                        className={
                          item.passed
                            ? "font-medium text-emerald-700"
                            : "font-medium text-red-700"
                        }
                      >
                        {item.passed ? "Passed" : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Safety snapshot is unavailable because the source draft is missing.
                </p>
              )}
            </Panel>

            {draft ? (
              <Link
                href={`/drafts/${draft.id}`}
                className="inline-flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
              >
                Open source draft
                <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}


type PublicationTimeShape = {
  scheduledFor?: number | string;
  sentAt?: number | string | null;
  updatedAt?: number | string;
};

function getPublicationTime(publication: PublicationTimeShape) {
  return (
    publication.sentAt ?? publication.scheduledFor ?? publication.updatedAt ?? Date.now()
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
      <p className="mt-2 break-words text-2xl font-semibold tracking-normal">
        {value}
      </p>
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

type AuditRowProps = {
  label: string;
  value: string;
};

function AuditRow({ label, value }: AuditRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

