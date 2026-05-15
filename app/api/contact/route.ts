// app/api/contact/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { submitContact } from "@/app/actions/contact";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const formData = new FormData();

  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    formData.set("name",    String(body.name ?? ""));
    formData.set("email",   String(body.email ?? ""));
    formData.set("subject", String(body.subject ?? ""));
    formData.set("message", String(body.message ?? ""));
    formData.set("hp",      "");
  } else {
    const incoming = await req.formData();
    for (const k of ["name", "email", "subject", "message", "hp"] as const) {
      formData.set(k, String(incoming.get(k) ?? ""));
    }
  }

  const result = await submitContact({ status: "idle" }, formData);
  const status = result.status === "ok" ? 200 : result.status === "error" ? 400 : 200;
  return NextResponse.json(result, { status });
}
