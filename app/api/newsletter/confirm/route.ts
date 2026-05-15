// app/api/newsletter/confirm/route.ts
// GET /api/newsletter/confirm?token=<uuid> — flips confirmed=true and redirects.
import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(absoluteUrl("/newsletter?status=invalid"));
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true })
    .eq("confirm_token", token)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(absoluteUrl("/newsletter?status=invalid"));
  }
  return NextResponse.redirect(absoluteUrl("/newsletter?status=confirmed"));
}
