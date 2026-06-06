import { RoutePlaceholder } from "@/app/_components/route-placeholder";

type DraftDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DraftDetailsPage({
  params,
}: DraftDetailsPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Draft: ${id}`}
      description="Draft editor and Telegram preview with publication blocked until safety checks pass."
      items={["Draft editor", "Telegram preview", "Safety review", "Manual approval"]}
    />
  );
}
