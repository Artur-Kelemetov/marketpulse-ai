import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { getMockAssets } from "@/lib/mock-data";

import { NewIdeaForm } from "./new-idea-form";

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

        <NewIdeaForm assets={assets} />
      </div>
    </main>
  );
}
