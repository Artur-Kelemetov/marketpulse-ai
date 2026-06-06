import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function DraftsPage() {
  return (
    <RoutePlaceholder
      title="Drafts"
      description="Editable Telegram post drafts with safety state and publication readiness."
      items={[
        "Draft list",
        "Missing disclaimer warning",
        "Missing risk notes warning",
        "Review status",
      ]}
    />
  );
}
