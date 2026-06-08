"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PublishPublicationResponse } from "@/lib/telegram/publish-publication-contract";

type PublishToTelegramButtonProps = {
  publicationId: string;
  disabled?: boolean;
};

export function PublishToTelegramButton({
  publicationId,
  disabled = false,
}: PublishToTelegramButtonProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePublish() {
    setIsPublishing(true);
    setMessage("Publishing to Telegram...");

    try {
      const response = await fetch("/api/telegram/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicationId }),
      });
      const data = (await response.json()) as
        | PublishPublicationResponse
        | { error?: string; message?: string };

      if (!response.ok || !("publication" in data)) {
        const errorMessage =
          "message" in data ? data.message : "error" in data ? data.error : null;

        throw new Error(errorMessage ?? "Telegram publish failed.");
      }

      setMessage(
        data.publication.status === "sent"
          ? "Telegram message sent."
          : "Telegram publish failed. Status saved.",
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Telegram publish failed.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <Button
        type="button"
        variant="outline"
        className="justify-start"
        disabled={disabled || isPublishing}
        onClick={handlePublish}
      >
        <Send className="size-4" />
        {isPublishing ? "Publishing..." : "Publish to Telegram"}
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}