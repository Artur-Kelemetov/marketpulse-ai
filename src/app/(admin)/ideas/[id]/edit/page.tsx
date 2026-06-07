import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Pencil,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  getMockAssetById,
  getMockMarketIdeaById,
  getMockMarketIdeas,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return getMockMarketIdeas().map((idea) => ({
    id: idea.id,
  }));
}

type EditIdeaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditIdeaPage({ params }: EditIdeaPageProps) {
  const { id } = await params;
  const idea = getMockMarketIdeaById(id);

  if (!idea) {
    notFound();
  }

  const relatedAssets = idea.assetIds.map((assetId) => ({
    id: assetId,
    label: getMockAssetById(assetId)?.displaySymbol ?? assetId,
  }));
  const safetyItems = [
    {
      label: "Disclaimer present",
      passed: Boolean(idea.disclaimer.trim()),
    },
    {
      label: "Risk notes present",
      passed: idea.riskNotes.length > 0,
    },
    {
      label: "Invalidation scenario present",
      passed: Boolean(idea.invalidationScenario.trim()),
    },
    {
      label: "No blocking compliance flags",
      passed: !idea.complianceFlags.some((flag) => flag.severity === "blocking"),
    },
  ];
  const telegramPreview = [
    idea.title,
    "",
    `${idea.suggestedAction.toUpperCase()} idea · ${idea.conviction} conviction · ${idea.timeHorizon}`,
    "",
    idea.summary,
    "",
    "Why now:",
    ...idea.whyNow.map((item) => `- ${item}`),
    "",
    "Risks:",
    ...idea.riskNotes.map((item) => `- ${item}`),
    "",
    `Invalidation: ${idea.invalidationScenario}`,
    "",
    idea.disclaimer,
  ].join("\n");

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title={`Edit: ${idea.title}`}
        description="Manual editorial pass before this market idea becomes a Telegram draft."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href={`/ideas/${idea.id}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to idea
          </Link>

          <div className="flex flex-wrap gap-2">
            {relatedAssets.map((asset) => (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {asset.label}
              </Link>
            ))}
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-5">
            <EditorPanel title="Title" icon={<Pencil className="size-4" />}>
              <ReadOnlyField>{idea.title}</ReadOnlyField>
            </EditorPanel>

            <EditorPanel title="Summary" icon={<FileText className="size-4" />}>
              <ReadOnlyField>{idea.summary}</ReadOnlyField>
            </EditorPanel>

            <EditorPanel title="Thesis" icon={<FileText className="size-4" />}>
              <ReadOnlyField>{idea.thesis}</ReadOnlyField>
            </EditorPanel>

            <EditorPanel title="Why now" icon={<CheckCircle2 className="size-4" />}>
              <ReadonlyList items={idea.whyNow} />
            </EditorPanel>

            <EditorPanel title="Key factors" icon={<CheckCircle2 className="size-4" />}>
              <ReadonlyList items={idea.keyFactors} />
            </EditorPanel>
          </div>

          <aside className="flex flex-col gap-5">
            <EditorPanel title="Safety checklist" icon={<ShieldAlert className="size-4" />}>
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
            </EditorPanel>

            <EditorPanel title="Risk notes" icon={<ShieldAlert className="size-4" />}>
              <ReadonlyList items={idea.riskNotes} />
            </EditorPanel>

            <EditorPanel title="Invalidation scenario" icon={<ShieldAlert className="size-4" />}>
              <ReadOnlyField>{idea.invalidationScenario}</ReadOnlyField>
            </EditorPanel>

            <EditorPanel title="Disclaimer">
              <ReadOnlyField>{idea.disclaimer}</ReadOnlyField>
            </EditorPanel>
          </aside>
        </section>

        <EditorPanel title="Telegram preview" icon={<Eye className="size-4" />}>
          <pre className="min-h-64 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
            {telegramPreview}
          </pre>
        </EditorPanel>
      </div>
    </main>
  );
}

type EditorPanelProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

function EditorPanel({ title, children, icon }: EditorPanelProps) {
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

type ReadOnlyFieldProps = {
  children: React.ReactNode;
};

function ReadOnlyField({ children }: ReadOnlyFieldProps) {
  return (
    <div className="min-h-20 rounded-lg border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
      {children}
    </div>
  );
}

type ReadonlyListProps = {
  items: string[];
};

function ReadonlyList({ items }: ReadonlyListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ReadOnlyField key={item}>{item}</ReadOnlyField>
      ))}
    </div>
  );
}
