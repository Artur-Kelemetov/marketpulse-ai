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
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-3 border-b border-border pb-6">
          <p className="text-sm font-medium text-muted-foreground">
            MarketPulse AI
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
        </header>

        {items.length > 0 ? (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card p-4 text-sm text-card-foreground"
              >
                {item}
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
