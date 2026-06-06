import { RoutePlaceholder } from "@/app/_components/route-placeholder";

type AssetDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssetDetailsPage({
  params,
}: AssetDetailsPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Asset: ${id}`}
      description="Asset detail screen with chart, snapshot, key metrics, and recent market ideas."
      items={["Market chart", "Asset snapshot", "Key metrics", "Recent ideas"]}
    />
  );
}
