import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function NewIdeaPage() {
  return (
    <RoutePlaceholder
      title="Idea Generator"
      description="Market idea generation form for asset, content type, suggested action, conviction, time horizon, tone, and author context."
      items={[
        "Asset selector",
        "Suggested action",
        "Conviction",
        "Time horizon",
        "Author context",
      ]}
    />
  );
}
