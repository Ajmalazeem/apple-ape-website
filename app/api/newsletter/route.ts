// app/api/newsletter/route.ts
// JSON API wrapper around the same logic as the server action.
// Useful for non-form clients (mobile app, webhook fan-out).
import { NextResponse, type NextRequest } from "next/server";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const formData = new FormData();

  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as { email?: string };
    formData.set("email", body.email ?? "");
    formData.set("hp", "");
  } else {
    const incoming = await req.formData();
    formData.set("email", String(incoming.get("email") ?? ""));
    formData.set("hp", String(incoming.get("hp") ?? ""));
  }

  const result = await subscribeNewsletter({ status: "idle" }, formData);
  const status = result.status === "ok" ? 200 : result.status === "error" ? 400 : 200;
  return NextResponse.json(result, { status });
}
