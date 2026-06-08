import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarDays,
  Gauge,
  History,
  Layers3,
  MessagesSquare,
  PenLine,
  Settings2,
} from "lucide-react";

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
  {
    href: "/chat",
    label: "AI Chat",
    description: "Assistant",
    icon: MessagesSquare,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Integrations",
    icon: Settings2,
  },
];
