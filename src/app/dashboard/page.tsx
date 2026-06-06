import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      title="Dashboard"
      description="Working overview for market context, watchlist, recent ideas, scheduled posts, publication status, and safety warnings."
      items={[
        "Market overview",
        "Watchlist",
        "Recent market ideas",
        "Scheduled posts",
        "Publication status",
        "Safety warnings",
      ]}
    />
  );
}
