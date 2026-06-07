import {
  reviewIdeaSafetyRequestSchema,
  type ReviewIdeaSafetyRequest,
  type SafetyReviewItem,
} from "@/lib/ai/review-idea-safety-contract";

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

  const items = buildSafetyReview(parsedRequest.data);
  const passedCount = items.filter((item) => item.passed).length;
  const blockingCount = items.filter(
    (item) => !item.passed && item.severity === "blocking",
  ).length;

  return Response.json({
    items,
    passedCount,
    totalCount: items.length,
    blockingCount,
  });
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
