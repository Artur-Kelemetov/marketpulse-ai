import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />
      {children}
    </div>
  );
}
