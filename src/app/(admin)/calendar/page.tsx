import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { listPersistedDrafts, getPersistedDraftById } from "@/lib/drafts/drafts-repository";
import { listPersistedScheduledPublications } from "@/lib/publications/publications-repository";
import {
  getMockDraftById,
  getMockDrafts,
  getMockScheduledPublications,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CalendarPage() {
  const persistedScheduledPublications = listPersistedScheduledPublications();
  const scheduledPublications =
    persistedScheduledPublications.length > 0
      ? persistedScheduledPublications
      : getMockScheduledPublications().toSorted(
          (a, b) =>
            new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime(),
        );
  const usingFallbackSchedule = persistedScheduledPublications.length === 0;
  const persistedDrafts = listPersistedDrafts();
  const drafts = persistedDrafts.length > 0 ? persistedDrafts : getMockDrafts();
  const readyDrafts = drafts.filter((draft) => draft.status === "ready").length;
  const nextPublication = scheduledPublications[0] ?? null;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Publication Calendar"
        description="Schedule view for upcoming Telegram publications and editorial planning."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Scheduled"
            value={scheduledPublications.length.toString()}
            helper={usingFallbackSchedule ? "Upcoming mock posts" : "Upcoming SQLite posts"}
            icon={<CalendarClock className="size-4" />}
          />
          <SummaryCard
            label="Ready drafts"
            value={readyDrafts.toString()}
            helper="Can be scheduled next"
            icon={<CheckCircle2 className="size-4" />}
          />
          <SummaryCard
            label="Next publication"
            value={
              nextPublication
                ? dateTimeFormatter.format(new Date(nextPublication.scheduledFor))
                : "None"
            }
            helper="Nearest scheduled slot"
            icon={<Clock className="size-4" />}
          />
          <SummaryCard
            label="Channel"
            value="Telegram"
            helper="Manual approval required"
            icon={<Send className="size-4" />}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-border bg-card text-card-foreground">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold">Upcoming timeline</h2>
              <p className="text-sm text-muted-foreground">
                Mock schedule for planned Telegram publications.
              </p>
            </div>

            <div className="divide-y divide-border">
              {scheduledPublications.map((publication) => {
                const draft =
                  getPersistedDraftById(publication.draftId) ??
                  getMockDraftById(publication.draftId);
                const scheduledFor = new Date(publication.scheduledFor);

                return (
                  <article key={publication.id} className="p-4">
                    <div className="grid gap-4 md:grid-cols-[140px_1fr_auto] md:items-start">
                      <div className="rounded-lg border border-border bg-background p-3 text-sm">
                        <p className="font-medium">
                          {dateFormatter.format(scheduledFor)}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {timeFormatter.format(scheduledFor)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold leading-6">
                          {publication.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {draft
                            ? draft.telegramText
                            : "Linked draft was not found."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge>Scheduled</Badge>
                          {draft ? <Badge>{draft.status}</Badge> : null}
                        </div>
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <Link
                          href={`/drafts/${publication.draftId}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Draft
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card text-card-foreground">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold">Scheduling notes</h2>
            </div>
            <div className="space-y-3 p-4 text-sm leading-6 text-muted-foreground">
              <p>
                Publishing remains manual-first. A scheduled item should still be reviewed before Telegram delivery.
              </p>
              <p>
                Drafts missing disclaimer, risk notes, or invalidation scenario must stay blocked until restored.
              </p>
              <p>
                This view is a timeline placeholder; a full calendar grid can be added when scheduling interactions are introduced.
              </p>
            </div>
          </aside>
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
};

function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex w-fit rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

