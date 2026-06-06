import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default function LoginPage() {
  return (
    <RoutePlaceholder
      title="Login"
      description="Telegram WebApp and admin session entry point will live here."
      items={[
        "Telegram initData verification",
        "HTTP-only session cookie",
        "Server-side auth checks",
      ]}
    />
  );
}
