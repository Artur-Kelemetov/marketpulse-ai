"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SchedulePublicationResponse } from "@/lib/publications/schedule-publication-contract";

type SchedulePublicationButtonProps = {
  draftId: string;
  disabled?: boolean;
};

export function SchedulePublicationButton({
  draftId,
  disabled = false,
}: SchedulePublicationButtonProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [publicationId, setPublicationId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSchedule() {
    setIsScheduling(true);
    setMessage("Scheduling publication...");

    try {
      const response = await fetch("/api/publications/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draftId }),
      });
      const data = (await response.json()) as
        | SchedulePublicationResponse
        | { error?: string; message?: string };

      if (!response.ok || !("publication" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Scheduling failed.");
      }

      setPublicationId(data.publication.id);
      setMessage("Publication scheduled.");
    } catch {
      setMessage("Only saved SQLite drafts can be scheduled.");
    } finally {
      setIsScheduling(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="outline"
        className="justify-start"
        disabled={disabled || isScheduling}
        onClick={handleSchedule}
      >
        <CalendarPlus className="size-4" />
        {isScheduling ? "Scheduling..." : "Schedule publication"}
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {publicationId ? (
        <Link
          href="/calendar"
          className="text-sm font-medium text-emerald-700 underline underline-offset-4"
        >
          Open calendar
        </Link>
      ) : null}
    </div>
  );
}
