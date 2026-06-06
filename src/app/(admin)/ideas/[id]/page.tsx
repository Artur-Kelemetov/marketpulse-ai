import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Pencil,
  ShieldAlert,
  Target,
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

type IdeaDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  const { id } = await params;
  const idea = getMockMarketIdeaById(id);

  if (!idea) {
    notFound();
  }

  const relatedAssets = idea.assetIds.map((assetId) => ({
    id: assetId,
    label: getMockAssetById(assetId)?.displaySymbol ?? assetId,
  }));

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title={idea.title}
        description="Validated market idea detail with thesis, why now, key factors, risks, invalidation scenario, and disclaimer."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/ideas"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to ideas
          </Link>

          <Link
            href={`/ideas/${idea.id}/edit`}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
          >
            <Pencil className="size-4" />
            Edit idea
          </Link>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FactCard label="Action" value={idea.suggestedAction} />
          <FactCard label="Conviction" value={idea.conviction} />
          <FactCard label="Status" value={idea.status} />
          <FactCard label="Horizon" value={idea.timeHorizon} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
            <Panel title="Summary" icon={<FileText className="size-4" />}>
              <p className="text-sm leading-6 text-muted-foreground">
                {idea.summary}
              </p>
            </Panel>

            <Panel title="Trade thesis" icon={<Target className="size-4" />}>
              <p className="text-sm leading-6 text-muted-foreground">
                {idea.thesis}
              </p>
            </Panel>

            <Panel title="Why now" icon={<CheckCircle2 className="size-4" />}>
              <BulletList items={idea.whyNow} />
            </Panel>

            <Panel title="Key factors" icon={<CheckCircle2 className="size-4" />}>
              <BulletList items={idea.keyFactors} />
            </Panel>
          </div>

          <aside className="flex flex-col gap-5">
            <Panel title="Related assets">
              <div className="flex flex-wrap gap-2">
                {relatedAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/assets/${asset.id}`}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {asset.label}
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel title="Risk notes" icon={<ShieldAlert className="size-4" />}>
              <BulletList items={idea.riskNotes} />
            </Panel>

            <Panel title="Invalidation scenario" icon={<ShieldAlert className="size-4" />}>
              <p className="text-sm leading-6 text-muted-foreground">
                {idea.invalidationScenario}
              </p>
            </Panel>

            {idea.educationalContext ? (
              <Panel title="Educational context">
                <p className="text-sm leading-6 text-muted-foreground">
                  {idea.educationalContext}
                </p>
              </Panel>
            ) : null}

            <Panel title="Disclaimer">
              <p className="text-sm leading-6 text-muted-foreground">
                {idea.disclaimer}
              </p>
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
      <p className="mt-2 text-2xl font-semibold capitalize tracking-normal">
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

type BulletListProps = {
  items: string[];
};

function BulletList({ items }: BulletListProps) {
  return (
    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
