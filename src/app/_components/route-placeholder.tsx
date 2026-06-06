import { FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";

type RoutePlaceholderProps = {
  title: string;
  description: string;
  items?: string[];
};

export function RoutePlaceholder({
  title,
  description,
  items = [],
}: RoutePlaceholderProps) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <PageHeader title={title} description={description} />

      <section className="flex-1 px-6 py-6">
        {items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card p-4 text-sm text-card-foreground"
              >
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
