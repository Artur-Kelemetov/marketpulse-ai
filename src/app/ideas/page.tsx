import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function IdeasPage() {
  return (
    <RoutePlaceholder
      title="Market Ideas"
      description="Generated and editorial market ideas with status, conviction, safety flags, and draft links."
      items={["Generated ideas", "Manual review", "Safety status", "Draft links"]}
    />
  );
}
