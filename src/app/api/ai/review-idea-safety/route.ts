import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { getOpenAIModelName, hasOpenAIConfig } from "@/lib/ai/openai-config";
import {
  reviewIdeaSafetyRequestSchema,
  safetyReviewItemSchema,
  type ReviewIdeaSafetyRequest,
  type ReviewIdeaSafetyResponse,
  type SafetyReviewItem,
} from "@/lib/ai/review-idea-safety-contract";

const aiSafetyReviewSchema = z.object({
  items: z.array(safetyReviewItemSchema).min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedRequest = reviewIdeaSafetyRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const response =
    (await reviewIdeaSafetyWithOpenAI(parsedRequest.data)) ??
    buildSafetyReviewResponse(buildSafetyReview(parsedRequest.data));

  return Response.json(response);
}

async function reviewIdeaSafetyWithOpenAI(
  request: ReviewIdeaSafetyRequest,
): Promise<ReviewIdeaSafetyResponse | null> {
  if (!hasOpenAIConfig()) {
    return null;
  }

  try {
    const { object } = await generateObject({
      model: openai.chat(getOpenAIModelName()),
      schema: aiSafetyReviewSchema,
      schemaName: "MarketIdeaSafetyReview",
      system: [
        "You are a market content safety reviewer.",
        "Review editorial market idea drafts before publication.",
        "Flag missing disclaimers, guaranteed-return language, weak risk notes, and missing invalidation scenarios.",
        "Use severity 'blocking' for issues that should prevent publishing, 'warning' for caution, and 'info' for non-blocking notes.",
      ].join(" "),
      prompt: buildSafetyReviewPrompt(request),
      temperature: 0.2,
      maxOutputTokens: 900,
    });

    return buildSafetyReviewResponse(object.items);
  } catch (error) {
    console.error("OpenAI safety review failed. Falling back to rule review.", error);
    return null;
  }
}

function buildSafetyReviewResponse(
  items: SafetyReviewItem[],
): ReviewIdeaSafetyResponse {
  const passedCount = items.filter((item) => item.passed).length;
  const blockingCount = items.filter(
    (item) => !item.passed && item.severity === "blocking",
  ).length;

  return {
    items,
    passedCount,
    totalCount: items.length,
    blockingCount,
  };
}

function buildSafetyReviewPrompt(request: ReviewIdeaSafetyRequest) {
  return [
    `Asset id: ${request.assetId}`,
    `Title: ${request.title}`,
    `Thesis: ${request.thesis}`,
    `Why now: ${request.whyNow}`,
    `Risk notes: ${request.riskNotes}`,
    `Invalidation scenario: ${request.invalidationScenario}`,
    `Disclaimer: ${request.disclaimer}`,
    "Return concise review items. Include at least disclaimer, risk notes, invalidation, and no profit promise checks.",
  ].join("\n");
}

function buildSafetyReview(request: ReviewIdeaSafetyRequest): SafetyReviewItem[] {
  const joinedText = [
    request.title,
    request.thesis,
    request.whyNow,
    request.riskNotes,
    request.invalidationScenario,
  ]
    .join(" ")
    .toLowerCase();
  const disclaimer = request.disclaimer.toLowerCase();

  return [
    {
      label: "Idea basics",
      description: "Asset, title, and thesis are present.",
      passed: Boolean(
        request.assetId && request.title.trim() && request.thesis.trim(),
      ),
      severity: "blocking",
    },
    {
      label: "Clear disclaimer",
      description: "The text says it is not financial advice.",
      passed:
        disclaimer.includes("not financial advice") ||
        disclaimer.includes("не является") ||
        disclaimer.includes("финансовой рекомендацией"),
      severity: "blocking",
    },
    {
      label: "Risk notes",
      description: "Downside, uncertainty, or volatility is described.",
      passed: Boolean(request.riskNotes.trim()),
      severity: "blocking",
    },
    {
      label: "Invalidation",
      description: "The setup has a condition that makes the idea wrong.",
      passed: Boolean(request.invalidationScenario.trim()),
      severity: "blocking",
    },
    {
      label: "No profit promise",
      description: "The idea avoids guaranteed-return language.",
      passed: !/guaranteed|guarantee|risk-free|без риска|гарант/.test(
        joinedText,
      ),
      severity: "warning",
    },
  ];
}
