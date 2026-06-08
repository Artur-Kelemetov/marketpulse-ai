import { getSystemStatus } from "@/lib/system/system-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getSystemStatus());
}