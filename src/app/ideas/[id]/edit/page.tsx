import { RoutePlaceholder } from "@/app/_components/route-placeholder";

type EditIdeaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditIdeaPage({ params }: EditIdeaPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Edit Idea: ${id}`}
      description="Manual editorial pass for the generated idea before it becomes a Telegram draft."
      items={["Editable thesis", "Safety review", "Required edits", "Create draft"]}
    />
  );
}
