import { RoutePlaceholder } from "@/app/_components/route-placeholder";

type PublicationDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicationDetailsPage({
  params,
}: PublicationDetailsPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Publication: ${id}`}
      description="Single publication audit record with Telegram result, draft source, and safety metadata."
      items={[
        "Telegram message id",
        "Source draft",
        "Safety metadata",
        "Error details",
      ]}
    />
  );
}
