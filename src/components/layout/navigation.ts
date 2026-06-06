import type { LucideIcon } from "lucide-react";
import { Bot, CalendarDays, Gauge, History, Layers3, PenLine } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
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
];
