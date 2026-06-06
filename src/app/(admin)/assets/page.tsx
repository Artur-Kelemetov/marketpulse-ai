import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function AssetsPage() {
  return (
    <RoutePlaceholder
      title="Assets"
      description="Asset list with filters for crypto, stocks, indices, and ETF."
      items={[
        "Crypto filter",
        "Stock filter",
        "Index filter",
        "ETF filter",
        "Asset table",
        "Market snapshots",
      ]}
    />
  );
}
