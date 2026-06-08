"use client";

import Link from "next/link";
import { useState } from "react";
import { FilePlus2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CreateDraftResponse } from "@/lib/drafts/create-draft-contract";

type CreateDraftButtonProps = {
  ideaId: string;
};

export function CreateDraftButton({ ideaId }: CreateDraftButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreateDraft() {
    setIsCreating(true);
    setMessage("Creating draft...");

    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ideaId }),
      });
      const data = (await response.json()) as
        | CreateDraftResponse
        | { error?: string; message?: string };

      if (!response.ok || !("draft" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Draft creation failed.");
      }

      setDraftId(data.draft.id);
      setMessage("Draft created.");
    } catch {
      setMessage("Save this idea first, then create a draft.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <Button
        type="button"
        variant="outline"
        className="justify-start"
        disabled={isCreating}
        onClick={handleCreateDraft}
      >
        <FilePlus2 className="size-4" />
        {isCreating ? "Creating draft..." : "Create draft"}
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {draftId ? (
        <Link
          href={`/drafts/${draftId}`}
          className="text-sm font-medium text-emerald-700 underline underline-offset-4"
        >
          Open draft
        </Link>
      ) : null}
    </div>
  );
}
