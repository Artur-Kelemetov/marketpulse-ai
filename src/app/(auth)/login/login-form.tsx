"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

type LoginFormProps = {
  nextPath: string;
  authEnabled: boolean;
};

export function LoginForm({ nextPath, authEnabled }: LoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Checking password...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? data.error ?? "Login failed.");
      }

      setMessage("Logged in.");
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!authEnabled) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700">
            <LockKeyhole className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Admin auth is not configured</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local to enable password protection.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
        >
          Open dashboard
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border bg-card p-5 text-card-foreground"
    >
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Admin password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !password.trim()}>
        <LockKeyhole className="size-4" />
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}