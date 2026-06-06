import { RoutePlaceholder } from "@/app/_components/route-placeholder";

type IdeaDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Market Idea: ${id}`}
      description="Validated market idea detail with thesis, why now, key factors, risks, invalidation scenario, and disclaimer."
      items={["Trade thesis", "Why now", "Key factors", "Risk notes", "Disclaimer"]}
    />
  );
}
