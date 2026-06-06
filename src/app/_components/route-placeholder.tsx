import Link from "next/link";
import {
  Bot,
  CalendarDays,
  FileText,
  Gauge,
  History,
  Layers3,
  PenLine,
} from "lucide-react";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview",
    icon: Gauge,
  },
  {
    href: "/assets",
    label: "Assets",
    description: "Markets",
    icon: Layers3,
  },
  {
    href: "/ideas",
    label: "Ideas",
    description: "Theses",
    icon: Bot,
  },
  {
    href: "/drafts",
    label: "Drafts",
    description: "Editor",
    icon: PenLine,
  },
  {
    href: "/calendar",
    label: "Calendar",
    description: "Schedule",
    icon: CalendarDays,
  },
  {
    href: "/publications",
    label: "Publications",
    description: "History",
    icon: History,
  },
] as const;

type RoutePlaceholderProps = {
  title: string;
  description: string;
  items?: string[];
  shell?: boolean;
};

export function RoutePlaceholder({
  title,
  description,
  items = [],
  shell = true,
}: RoutePlaceholderProps) {
  const content = (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
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

  if (!shell) {
    return content;
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-sidebar px-4 py-4 text-sidebar-foreground lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 lg:block">
          <Link href="/dashboard" className="block space-y-1">
            <span className="block text-base font-semibold">MarketPulse AI</span>
            <span className="block text-xs text-muted-foreground">
              Market ideas admin
            </span>
          </Link>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-w-40 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:min-w-0"
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {content}
    </div>
  );
}
