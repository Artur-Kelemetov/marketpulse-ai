import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function PublicationsPage() {
  return (
    <RoutePlaceholder
      title="Publication History"
      description="Publication log with Telegram delivery status, message ids, and error states."
      items={["Publication log", "Telegram status", "Delivery errors", "Audit trail"]}
    />
  );
}
