"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Bot, CheckCircle2, FileText, Save, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MockAsset } from "@/lib/mock-data";

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

type NewIdeaFormValues = {
  assetId: string;
  contentType: string;
  suggestedAction: string;
  conviction: string;
  timeHorizon: string;
  marketMood: string;
  title: string;
  thesis: string;
  whyNow: string;
  riskNotes: string;
  invalidationScenario: string;
  disclaimer: string;
  authorContext: string;
};

type NewIdeaFormProps = {
  assets: MockAsset[];
};

export function NewIdeaForm({ assets }: NewIdeaFormProps) {
  const [values, setValues] = useState<NewIdeaFormValues>({
    assetId: assets[0]?.id ?? "",
    contentType: "trade_idea",
    suggestedAction: "watch",
    conviction: "medium",
    timeHorizon: "swing",
    marketMood: "neutral",
    title: "",
    thesis: "",
    whyNow: "",
    riskNotes: "",
    invalidationScenario: "",
    disclaimer: "Not financial advice. For educational purposes only.",
    authorContext: "",
  });
  const [workflowMessage, setWorkflowMessage] = useState(
    "Fill the form to prepare a local draft preview.",
  );

  const selectedAsset = assets.find((asset) => asset.id === values.assetId);
  const safetyItems = useMemo(() => buildSafetyItems(values), [values]);
  const passedSafetyCount = safetyItems.filter((item) => item.passed).length;
  const readyForMockGeneration = Boolean(
    values.assetId && values.title.trim() && values.thesis.trim(),
  );
  const draftPreview = buildDraftPreview(values, selectedAsset);

  function updateField(name: keyof NewIdeaFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleGenerateClick() {
    if (!readyForMockGeneration) {
      setWorkflowMessage("Add an asset, title, and thesis before mock generation.");
      return;
    }

    setWorkflowMessage("Mock AI generation prepared the preview from your inputs.");
  }

  function handleReviewClick() {
    const missingItems = safetyItems
      .filter((item) => !item.passed)
      .map((item) => item.label.toLowerCase());

    setWorkflowMessage(
      missingItems.length === 0
        ? "Safety review passed locally. This can move toward draft creation."
        : `Safety review found missing items: ${missingItems.join(", ")}.`,
    );
  }

  function handleSaveClick() {
    setWorkflowMessage("Draft prepared locally. Persistence will be connected later.");
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <form className="flex flex-col gap-5">
        <Panel title="Idea setup" icon={<Bot className="size-4" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Asset"
              name="assetId"
              value={values.assetId}
              helper="Primary market, token, stock, ETF, or index."
              onChange={updateField}
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.displaySymbol} - {asset.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Content type"
              name="contentType"
              value={values.contentType}
              helper="What kind of post this idea should become."
              onChange={updateField}
            >
              {contentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Suggested action"
              name="suggestedAction"
              value={values.suggestedAction}
              helper="Editorial stance, not personal advice."
              onChange={updateField}
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Conviction"
              name="conviction"
              value={values.conviction}
              helper="How strong the idea is right now."
              onChange={updateField}
            >
              {convictionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Time horizon"
              name="timeHorizon"
              value={values.timeHorizon}
              helper="Expected observation window."
              onChange={updateField}
            >
              {horizonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Market mood"
              name="marketMood"
              value={values.marketMood}
              helper="Current tone for the setup."
              onChange={updateField}
            >
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
              value={values.title}
              placeholder="BTC breakout watch after consolidation"
              helper="Short internal title for the idea."
              onChange={updateField}
            />

            <TextAreaField
              label="Thesis"
              name="thesis"
              value={values.thesis}
              placeholder="Describe the core market idea, setup, and why it matters now."
              helper="Main argument the AI should use when drafting the post."
              rows={5}
              onChange={updateField}
            />

            <TextAreaField
              label="Why now"
              name="whyNow"
              value={values.whyNow}
              placeholder="Add catalysts, price behavior, volume, macro context, or news drivers."
              helper="Future version can split this into bullet points."
              rows={4}
              onChange={updateField}
            />

            <TextAreaField
              label="Risk notes"
              name="riskNotes"
              value={values.riskNotes}
              placeholder="What can go wrong? Mention volatility, invalid setup, liquidity, or macro risks."
              helper="Required before publication."
              rows={4}
              onChange={updateField}
            />

            <TextAreaField
              label="Invalidation scenario"
              name="invalidationScenario"
              value={values.invalidationScenario}
              placeholder="What would make this idea wrong or no longer useful?"
              helper="A clear invalidation keeps the post safer and less overconfident."
              rows={3}
              onChange={updateField}
            />

            <TextAreaField
              label="Disclaimer"
              name="disclaimer"
              value={values.disclaimer}
              placeholder="Not financial advice. For educational purposes only."
              helper="Required before publication."
              rows={3}
              onChange={updateField}
            />

            <TextAreaField
              label="Author context"
              name="authorContext"
              value={values.authorContext}
              placeholder="Tone, audience notes, source links, or extra instructions for the AI."
              helper="Optional context for the future AI generation endpoint."
              rows={4}
              onChange={updateField}
            />
          </div>
        </Panel>
      </form>

      <aside className="flex flex-col gap-5">
        <Panel title="Workflow" icon={<Sparkles className="size-4" />}>
          <div className="grid gap-2">
            <Button type="button" className="justify-start" onClick={handleGenerateClick}>
              <Sparkles className="size-4" />
              Generate with AI
            </Button>
            <Button type="button" variant="outline" className="justify-start" onClick={handleReviewClick}>
              <ShieldCheck className="size-4" />
              Review safety
            </Button>
            <Button type="button" variant="outline" className="justify-start" onClick={handleSaveClick}>
              <Save className="size-4" />
              Save draft
            </Button>
          </div>
          <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 text-muted-foreground">
            {workflowMessage}
          </p>
        </Panel>

        <Panel title="Safety status" icon={<ShieldCheck className="size-4" />}>
          <div className="mb-3 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            {passedSafetyCount} of {safetyItems.length} checks passed
          </div>
          <div className="space-y-3">
            {safetyItems.map((item) => (
              <ChecklistItem
                key={item.label}
                label={item.label}
                description={item.description}
                passed={item.passed}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Draft preview" icon={<FileText className="size-4" />}>
          <pre className="min-h-80 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
            {draftPreview}
          </pre>
        </Panel>
      </aside>
    </section>
  );
}

function buildDraftPreview(values: NewIdeaFormValues, asset?: MockAsset) {
  const assetLabel = asset ? `${asset.displaySymbol} (${asset.name})` : "No asset selected";

  return [
    values.title.trim() || "Untitled market idea",
    "",
    `${assetLabel} | ${values.suggestedAction.toUpperCase()} | ${values.conviction} conviction | ${values.timeHorizon}`,
    `Market mood: ${values.marketMood}`,
    "",
    "Thesis:",
    values.thesis.trim() || "Add the core thesis for this idea.",
    "",
    "Why now:",
    values.whyNow.trim() || "Add catalysts or context.",
    "",
    "Risks:",
    values.riskNotes.trim() || "Add risk notes before publication.",
    "",
    "Invalidation:",
    values.invalidationScenario.trim() || "Add a clear invalidation scenario.",
    "",
    values.disclaimer.trim() || "Add a financial disclaimer.",
  ].join("\n");
}

function buildSafetyItems(values: NewIdeaFormValues) {
  const joinedText = [values.title, values.thesis, values.whyNow, values.riskNotes]
    .join(" ")
    .toLowerCase();
  const disclaimer = values.disclaimer.toLowerCase();

  return [
    {
      label: "Idea basics",
      description: "Asset, title, and thesis are present.",
      passed: Boolean(values.assetId && values.title.trim() && values.thesis.trim()),
    },
    {
      label: "Clear disclaimer",
      description: "The text says it is not financial advice.",
      passed:
        disclaimer.includes("not financial advice") ||
        disclaimer.includes("не является") ||
        disclaimer.includes("финансовой рекомендацией"),
    },
    {
      label: "Risk notes",
      description: "Downside, uncertainty, or volatility is described.",
      passed: Boolean(values.riskNotes.trim()),
    },
    {
      label: "Invalidation",
      description: "The setup has a condition that makes the idea wrong.",
      passed: Boolean(values.invalidationScenario.trim()),
    },
    {
      label: "No profit promise",
      description: "The idea avoids guaranteed-return language.",
      passed: !/guaranteed|guarantee|risk-free|без риска|гарант/.test(joinedText),
    },
  ];
}

type PanelProps = {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
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

type FieldName = keyof NewIdeaFormValues;

type FieldShellProps = {
  label: string;
  helper: string;
  children: ReactNode;
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
  name: FieldName;
  value: string;
  helper: string;
  children: ReactNode;
  onChange: (name: FieldName, value: string) => void;
};

function SelectField({ label, name, value, helper, children, onChange }: SelectFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
      >
        {children}
      </select>
    </FieldShell>
  );
}

type TextFieldProps = {
  label: string;
  name: FieldName;
  value: string;
  helper: string;
  placeholder: string;
  onChange: (name: FieldName, value: string) => void;
};

function TextField({ label, name, value, helper, placeholder, onChange }: TextFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
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
  value,
  helper,
  placeholder,
  rows,
  onChange,
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} helper={helper}>
      <textarea
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </FieldShell>
  );
}

type ChecklistItemProps = {
  label: string;
  description: string;
  passed: boolean;
};

function ChecklistItem({ label, description, passed }: ChecklistItemProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2 font-medium">
        <CheckCircle2 className={passed ? "size-4 text-emerald-700" : "size-4 text-muted-foreground"} />
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
