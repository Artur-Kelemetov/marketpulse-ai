import Link from "next/link";

import { LogoutButton } from "./LogoutButton";
import { navigationItems } from "./navigation";

export function Sidebar() {
  return (
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

      <div className="mt-3 border-t border-border pt-3 lg:mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
