import { cookies } from "next/headers";
import { z } from "zod";

import {
  ADMIN_SESSION_COOKIE,
  getAdminPassword,
  getAdminSessionSecret,
  hasAdminAuthConfig,
} from "@/lib/auth/admin-auth-config";

const loginRequestSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!hasAdminAuthConfig()) {
    return Response.json(
      {
        error: "admin_auth_not_configured",
        message: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET to enable login.",
      },
      { status: 400 },
    );
  }

  const parsedRequest = loginRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "invalid_request",
        issues: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsedRequest.data.password !== getAdminPassword()) {
    return Response.json(
      { error: "invalid_password", message: "Invalid admin password." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}