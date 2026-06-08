"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Square } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const starterPrompts = [
  "Review the current BTC idea for risk language.",
  "Suggest a concise publication angle for Apple earnings.",
  "What should I check before scheduling a market idea?",
];

export function ChatPanel() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
      }),
    [],
  );
  const { messages, sendMessage, status, stop, error } = useChat({
    transport,
  });
  const [input, setInput] = useState("");
  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isBusy) {
      return;
    }

    sendMessage({ text });
    setInput("");
  }

  function sendStarterPrompt(prompt: string) {
    if (isBusy) {
      return;
    }

    sendMessage({ text: prompt });
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="flex min-h-[36rem] flex-col rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Research chat</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Streaming answers from the AI SDK endpoint.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-80 items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-lg font-semibold">Start with a market question</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use chat for quick research, wording checks, and safety review
                  before turning an idea into a draft.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                    : "max-w-[80%] rounded-lg border border-border bg-background px-4 py-3"
                }
              >
                <div className="mb-2 text-xs font-medium uppercase tracking-normal opacity-70">
                  {message.role === "user" ? "You" : "MarketPulse AI"}
                </div>
                <div className="space-y-2 text-sm leading-6">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p key={index} className="whitespace-pre-wrap">
                        {part.text}
                      </p>
                    ) : null,
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {error ? (
          <div className="border-t border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-border p-4"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isBusy}
            rows={2}
            className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Ask about an idea, asset, draft, or publication risk..."
          />
          {isBusy ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
              aria-label="Stop response"
            >
              <Square className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          )}
        </form>
      </div>

      <aside className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Starter prompts</h2>
          <div className="mt-3 space-y-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendStarterPrompt(prompt)}
                disabled={isBusy}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-left text-sm leading-5 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
          Chat uses the same OpenAI configuration as idea generation. With the
          placeholder API key, the endpoint returns a configuration error.
        </div>
      </aside>
    </section>
  );
}
