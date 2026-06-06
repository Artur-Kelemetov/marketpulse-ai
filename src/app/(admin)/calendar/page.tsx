import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function CalendarPage() {
  return (
    <RoutePlaceholder
      title="Publication Calendar"
      description="Schedule view for upcoming Telegram publications and editorial planning."
      items={[
        "Scheduled posts",
        "Calendar view",
        "Draft readiness",
        "Publication windows",
      ]}
    />
  );
}
