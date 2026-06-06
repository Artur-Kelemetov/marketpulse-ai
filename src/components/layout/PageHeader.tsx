type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-background px-6 py-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          MarketPulse AI
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
