import { AlertTriangle, CheckCircle2, CircleDashed, Database, KeyRound, Send } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { getSystemStatus, type IntegrationStatus } from "@/lib/system/system-status";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const status = getSystemStatus();
  const readyCount = [status.database, status.openai, status.telegram].filter(
    (item) => item.status === "ok",
  ).length;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="Settings"
        description="Integration readiness for local database, OpenAI generation, and Telegram publishing."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <section className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="Ready" value={`${readyCount}/3`} helper="Configured integrations" />
          <SummaryCard label="OpenAI model" value={status.openai.model} helper="Used by AI routes" />
          <SummaryCard label="Status API" value="/api/system/status" helper="Machine-readable health check" />
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <IntegrationCard
            title="Database"
            description="SQLite persistence for ideas, drafts, schedules, and publication logs."
            status={status.database.status}
            label={status.database.label}
            detail={status.database.detail}
            icon={<Database className="size-5" />}
          />
          <IntegrationCard
            title="OpenAI"
            description="Structured idea generation and safety review through AI routes."
            status={status.openai.status}
            label={status.openai.label}
            detail={status.openai.detail}
            icon={<KeyRound className="size-5" />}
          />
          <IntegrationCard
            title="Telegram"
            description="Manual publication delivery through the Telegram Bot API."
            status={status.telegram.status}
            label={status.telegram.label}
            detail={status.telegram.detail}
            icon={<Send className="size-5" />}
          />
        </section>

        <section className="rounded-lg border border-border bg-card text-card-foreground">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">Environment checklist</h2>
          </div>
          <div className="divide-y divide-border">
            <ChecklistRow name="DATABASE_URL" value="file:./data/marketpulse.db" status={status.database.status} />
            <ChecklistRow name="OPENAI_API_KEY" value="required for real AI generation" status={status.openai.status} />
            <ChecklistRow name="OPENAI_MODEL" value={status.openai.model} status={status.openai.status === "error" ? "error" : "ok"} />
            <ChecklistRow name="TELEGRAM_BOT_TOKEN" value="required for Telegram publishing" status={status.telegram.status} />
            <ChecklistRow name="TELEGRAM_CHANNEL_ID" value="required for Telegram publishing" status={status.telegram.status} />
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
};

function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold tracking-normal">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}

type IntegrationCardProps = {
  title: string;
  description: string;
  status: IntegrationStatus;
  label: string;
  detail: string;
  icon: React.ReactNode;
};

function IntegrationCard({
  title,
  description,
  status,
  label,
  detail,
  icon,
}: IntegrationCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card text-card-foreground">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4">
        <div className="space-y-1">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-2 text-muted-foreground">
          {icon}
        </div>
      </div>
      <div className="space-y-3 p-4">
        <StatusBadge status={status} />
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
      </div>
    </article>
  );
}

type ChecklistRowProps = {
  name: string;
  value: string;
  status: IntegrationStatus;
};

function ChecklistRow({ name, value, status }: ChecklistRowProps) {
  return (
    <div className="grid gap-2 px-4 py-3 text-sm md:grid-cols-[220px_1fr_120px] md:items-center">
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground">{value}</span>
      <StatusBadge status={status} compact />
    </div>
  );
}

type StatusBadgeProps = {
  status: IntegrationStatus;
  compact?: boolean;
};

function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const config = {
    ok: {
      label: "Ready",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: <CheckCircle2 className="size-4" />,
    },
    missing: {
      label: "Missing",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      icon: <CircleDashed className="size-4" />,
    },
    error: {
      label: "Error",
      className: "border-red-200 bg-red-50 text-red-700",
      icon: <AlertTriangle className="size-4" />,
    },
  }[status];

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {compact ? null : config.icon}
      {config.label}
    </span>
  );
}