import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  hasAdminAuthConfig,
  isValidAdminSession,
} from "@/lib/auth/admin-auth-config";

import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const authEnabled = hasAdminAuthConfig();

  if (authEnabled && isValidAdminSession(session)) {
    redirect(nextPath);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">MarketPulse AI</p>
          <h1 className="text-3xl font-semibold tracking-normal">Admin login</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Password session for the local admin dashboard.
          </p>
        </div>
        <LoginForm nextPath={nextPath} authEnabled={authEnabled} />
      </div>
    </main>
  );
}

function sanitizeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}