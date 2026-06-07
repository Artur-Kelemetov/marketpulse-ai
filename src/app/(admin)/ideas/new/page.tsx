import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  FileText,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { getMockAssets } from "@/lib/mock-data";

const contentTypeOptions = [
  { value: "trade_idea", label: "Trade idea" },
  { value: "asset_analysis", label: "Asset analysis" },
  { value: "market_watchlist", label: "Market watchlist" },
  { value: "daily_market_brief", label: "Daily market brief" },
  { value: "news_reaction", label: "News reaction" },
];

const actionOptions = [
  { value: "watch", label: "Watch" },
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
  { value: "hold", label: "Hold" },
];

const convictionOptions = [
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
];

const horizonOptions = [
  { value: "swing", label: "Swing" },
  { value: "intraday", label: "Intraday" },
  { value: "long_term", label: "Long term" },
  { value: "unknown", label: "Unknown" },
];

const moodOptions = [
  { value: "neutral", label: "Neutral" },
  { value: "bullish", label: "Bullish" },
  { value: "bearish", label: "Bearish" },
  { value: "volatile", label: "Volatile" },
  { value: "uncertain", label: "Uncertain" },
];

export default function NewIdeaPage() {
  const assets = getMockAssets();

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader
        title="New Market Idea"
        description="Create a structured market idea before AI generation, safety review, and Telegram draft preparation."
      />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <Link
          href="/ideas"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to ideas
        </Link>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <form className="flex flex-col gap-5">
            <Panel title="Idea setup" icon={<Bot className="size-4" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField label="Asset" name="assetId" helper="Primary market, token, stock, ETF, or index.">
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displaySymbol} - {asset.name}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Content type" name="contentType" helper="What kind of post this idea should become.">
                  {contentTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Suggested action" name="suggestedAction" helper="Editorial stance, not personal advice.">
                  {actionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Conviction" name="conviction" helper="How strong the idea is right now.">
                  {convictionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Time horizon" name="timeHorizon" helper="Expected observation window.">
                  {horizonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Market mood" name="marketMood" helper="Current tone for the setup.">
                  {moodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
              </div>
            </Panel>

            <Panel title="Editorial input" icon={<FileText className="size-4" />}>
              <div className="grid gap-4">
                <TextField
                  label="Working title"
                  name="title"
                  placeholder="BTC breakout watch after consolidation"
                  helper="Short internal title for the idea."
                />

                <TextAreaField
                  label="Thesis"
                  name="thesis"
                  placeholder="Describe the core market idea, setup, and why it matters now."
                  helper="Main argument the AI should use when drafting the post."
                  rows={5}
                />

                <TextAreaField
                  label="Why now"
                  name="whyNow"
                  placeholder="Add catalysts, price behavior, volume, macro context, or news drivers."
                  helper="Future version can split this into bullet points."
                  rows={4}
                />

                <TextAreaField
                  label="Risk notes"
                  name="riskNotes"
                  placeholder="What can go wrong? Mention volatility, invalid setup, liquidity, or macro risks."
                  helper="Required before publication."
                  rows={4}
                />

                <TextAreaField
                  label="Invalidation scenario"
                  name="invalidationScenario"
                  placeholder="What would make this idea wrong or no longer useful?"
                  helper="A clear invalidation keeps the post safer and less overconfident."
                  rows={3}
                />

                <TextAreaField
                  label="Author context"
                  name="authorContext"
                  placeholder="Tone, audience notes, source links, or extra instructions for the AI."
                  helper="Optional context for the future AI generation endpoint."
                  rows={4}
                />
              </div>
            </Panel>
          </form>

          <aside className="flex flex-col gap-5">
            <Panel title="Workflow" icon={<Sparkles className="size-4" />}>
              <div className="grid gap-2">
                <Button type="button" className="justify-start">
                  <Sparkles className="size-4" />
                  Generate with AI
                </Button>
                <Button type="button" variant="outline" className="justify-start">
                  <ShieldCheck className="size-4" />
                  Review safety
                </Button>
                <Button type="button" variant="outline" className="justify-start">
                  <Save className="size-4" />
                  Save draft
                </Button>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                These buttons are visual placeholders until we connect server actions, AI generation, and persistence.
              </p>
            </Panel>

            <Panel title="Safety requirements" icon={<ShieldCheck className="size-4" />}>
              <div className="space-y-3">
                <ChecklistItem label="Clear disclaimer" description="The final idea must say it is not financial advice." />
                <ChecklistItem label="Risk notes" description="The idea needs downside, volatility, or uncertainty notes." />
                <ChecklistItem label="Invalidation" description="The setup needs a condition that makes the idea wrong." />
                <ChecklistItem label="No profit promise" description="Avoid guaranteed returns and overconfident language." />
              </div>
            </Panel>

            <Panel title="Draft preview" icon={<FileText className="size-4" />}>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                Fill the form, then the future AI step will turn it into a structured market idea and Telegram draft preview.
              </div>
            </Panel>
          </aside>
        </section>
      </div>
    </main>
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

type FieldShellProps = {
  label: string;
  helper: string;
  children: React.ReactNode;
};

function FieldShell({ label, helper, children }: FieldShellProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      <span className="text-xs leading-5 text-muted-foreground">{helper}</span>
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  helper: string;
  children: React.ReactNode;
};

function SelectField({ label, name, helper, children }: SelectFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <select
        name={name}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
      >
        {children}
      </select>
    </FieldShell>
  );
}

type TextFieldProps = {
  label: string;
  name: string;
  helper: string;
  placeholder: string;
};

function TextField({ label, name, helper, placeholder }: TextFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <input
        name={name}
        placeholder={placeholder}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = TextFieldProps & {
  rows: number;
};

function TextAreaField({
  label,
  name,
  helper,
  placeholder,
  rows,
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </FieldShell>
  );
}

type ChecklistItemProps = {
  label: string;
  description: string;
};

function ChecklistItem({ label, description }: ChecklistItemProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2 font-medium">
        <ShieldCheck className="size-4 text-emerald-700" />
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
