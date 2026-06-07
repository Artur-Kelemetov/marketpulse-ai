import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  History,
  MessageSquare,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { getMockDraftById, getMockPublicationLog } from "@/lib/mock-data";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function PublicationsPage() {
  const publicationLog = getMockPublicationLog().toSorted(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
  );
  const sentCount = publicationLog.filter(
    (publication) => publication.status === "sent",
  ).length;
  const failedCount = publicationLog.filter(
    (publication) => publication.status === "failed",
  ).length;
  const latestPublication = publicationLog[0] ?? null;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Publication History"
        description="Publication log with Telegram delivery status, message ids, and error states."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total events"
            value={publicationLog.length.toString()}
            helper="Mock Telegram log"
            icon={<History className="size-4" />}
          />
          <SummaryCard
            label="Sent"
            value={sentCount.toString()}
            helper="Delivered successfully"
            icon={<CheckCircle2 className="size-4" />}
          />
          <SummaryCard
            label="Failed"
            value={failedCount.toString()}
            helper="Needs operator review"
            icon={<AlertTriangle className="size-4" />}
          />
          <SummaryCard
            label="Latest"
            value={
              latestPublication
                ? dateTimeFormatter.format(new Date(latestPublication.sentAt))
                : "None"
            }
            helper="Most recent log entry"
            icon={<MessageSquare className="size-4" />}
          />
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">Telegram delivery log</h2>
            <p className="text-sm text-muted-foreground">
              Sent and failed publication attempts from the mock Telegram channel flow.
            </p>
          </div>

          <div className="divide-y divide-border">
            {publicationLog.map((publication) => {
              const draft = getMockDraftById(publication.draftId);

              return (
                <article key={publication.id} className="p-4 transition-colors hover:bg-muted/30">
                  <div className="grid gap-4 xl:grid-cols-[1fr_280px] xl:items-start">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={publication.status} />
                        {publication.telegramMessageId ? (
                          <Badge>Message #{publication.telegramMessageId}</Badge>
                        ) : null}
                      </div>

                      <div>
                        <Link
                          href={`/publications/${publication.id}`}
                          className="text-base font-semibold leading-6 hover:underline"
                        >
                          {publication.title}
                        </Link>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {publication.status === "failed"
                            ? publication.errorMessage
                            : "Telegram Bot API accepted the message and returned a message id."}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <LogFact
                        label="Sent at"
                        value={dateTimeFormatter.format(new Date(publication.sentAt))}
                      />
                      {draft ? (
                        <Link
                          href={`/drafts/${draft.id}`}
                          className="inline-flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          Source draft
                          <ArrowUpRight className="size-4" />
                        </Link>
                      ) : (
                        <LogFact label="Source draft" value="Missing" />
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

type StatusBadgeProps = {
  status: "sent" | "failed";
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isSent = status === "sent";

  return (
    <span
      className={
        isSent
          ? "inline-flex w-fit rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
          : "inline-flex w-fit rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
      }
    >
      {isSent ? "Sent" : "Failed"}
    </span>
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

type LogFactProps = {
  label: string;
  value: string;
};

function LogFact({ label, value }: LogFactProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-3 py-2">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
