"use client";

import { useState, type ReactNode } from "react";
import { Bot, CheckCircle2, FileText, Save, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GenerateIdeaResponse } from "@/lib/ai/generate-idea-contract";
import type {
  ReviewIdeaSafetyResponse,
  SafetyReviewItem,
} from "@/lib/ai/review-idea-safety-contract";
import type { CreateIdeaResponse } from "@/lib/ideas/create-idea-contract";
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
const defaultSafetyItems: SafetyReviewItem[] = [
  {
    label: "Idea basics",
    description: "Asset, title, and thesis are present.",
    passed: false,
    severity: "blocking",
  },
  {
    label: "Clear disclaimer",
    description: "The text says it is not financial advice.",
    passed: false,
    severity: "blocking",
  },
  {
    label: "Risk notes",
    description: "Downside, uncertainty, or volatility is described.",
    passed: false,
    severity: "blocking",
  },
  {
    label: "Invalidation",
    description: "The setup has a condition that makes the idea wrong.",
    passed: false,
    severity: "blocking",
  },
  {
    label: "No profit promise",
    description: "The idea avoids guaranteed-return language.",
    passed: false,
    severity: "warning",
  },
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const [safetyItems, setSafetyItems] =
    useState<SafetyReviewItem[]>(defaultSafetyItems);

  const selectedAsset = assets.find((asset) => asset.id === values.assetId);
  const passedSafetyCount = safetyItems.filter((item) => item.passed).length;
  const readyForMockGeneration = Boolean(values.assetId && selectedAsset);
  const draftPreview = buildDraftPreview(values, selectedAsset);

  function updateField(name: keyof NewIdeaFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setSafetyItems(defaultSafetyItems);
    setSavedIdeaId(null);
  }

  async function handleGenerateClick() {
    if (!readyForMockGeneration || !selectedAsset) {
      setWorkflowMessage("Select an asset before generation.");
      return;
    }

    setIsGenerating(true);
    setWorkflowMessage("Generating idea through the API route...");

    try {
      const response = await fetch("/api/ai/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: values.assetId,
          contentType: values.contentType,
          suggestedAction: values.suggestedAction,
          conviction: values.conviction,
          timeHorizon: values.timeHorizon,
          marketMood: values.marketMood,
          authorContext: values.authorContext,
        }),
      });
      const data = (await response.json()) as
        | GenerateIdeaResponse
        | { error?: string; message?: string };

      if (!response.ok || !("idea" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Generation failed.");
      }

      setValues((currentValues) => ({
        ...currentValues,
        ...data.idea,
      }));
      setSafetyItems(defaultSafetyItems);
      setSavedIdeaId(null);
      setWorkflowMessage("API returned a mock-generated idea.");
    } catch {
      setWorkflowMessage("Could not generate idea through API. Try again.");
    } finally {
      setIsGenerating(false);
    }
  }
  async function handleReviewClick() {
    setIsReviewing(true);
    setWorkflowMessage("Reviewing idea safety through the API route...");

    try {
      const response = await fetch("/api/ai/review-idea-safety", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: values.assetId,
          title: values.title,
          thesis: values.thesis,
          whyNow: values.whyNow,
          riskNotes: values.riskNotes,
          invalidationScenario: values.invalidationScenario,
          disclaimer: values.disclaimer,
        }),
      });
      const data = (await response.json()) as
        | ReviewIdeaSafetyResponse
        | { error?: string; message?: string };

      if (!response.ok || !("items" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Safety review failed.");
      }

      setSafetyItems(data.items);
      setWorkflowMessage(
        data.blockingCount === 0
          ? "API safety review passed. This can move toward draft creation."
          : `API safety review found ${data.blockingCount} blocking issue(s).`,
      );
    } catch {
      setWorkflowMessage("Could not review safety through API. Try again.");
    } finally {
      setIsReviewing(false);
    }
  }
  async function handleSaveClick() {
    setIsSaving(true);
    setWorkflowMessage("Saving idea draft through the API route...");

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: values.assetId,
          contentType: values.contentType,
          suggestedAction: values.suggestedAction,
          conviction: values.conviction,
          timeHorizon: values.timeHorizon,
          marketMood: values.marketMood,
          title: values.title,
          thesis: values.thesis,
          whyNow: values.whyNow,
          riskNotes: values.riskNotes,
          invalidationScenario: values.invalidationScenario,
          disclaimer: values.disclaimer,
          authorContext: values.authorContext,
        }),
      });
      const data = (await response.json()) as
        | CreateIdeaResponse
        | { error?: string; message?: string };

      if (!response.ok || !("idea" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Save failed.");
      }

      setSavedIdeaId(data.idea.id);
      setWorkflowMessage(`Saved mock draft as ${data.idea.id}.`);
    } catch {
      setWorkflowMessage("Could not save draft through API. Check required fields and try again.");
    } finally {
      setIsSaving(false);
    }
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
            <Button
              type="button"
              className="justify-start"
              disabled={isGenerating}
              onClick={handleGenerateClick}
            >
              <Sparkles className="size-4" />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={isReviewing}
              onClick={handleReviewClick}
            >
              <ShieldCheck className="size-4" />
              {isReviewing ? "Reviewing..." : "Review safety"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={isSaving}
              onClick={handleSaveClick}
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save draft"}
            </Button>
          </div>
          <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 text-muted-foreground">
            {workflowMessage}
          </p>
          {savedIdeaId ? (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              Mock idea id: {savedIdeaId}
            </div>
          ) : null}
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
                severity={item.severity}
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
  severity: SafetyReviewItem["severity"];
};

function ChecklistItem({
  label,
  description,
  passed,
  severity,
}: ChecklistItemProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2 font-medium">
        <CheckCircle2
          className={
            passed
              ? "size-4 text-emerald-700"
              : severity === "blocking"
                ? "size-4 text-red-700"
                : "size-4 text-amber-700"
          }
        />
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

