// src/app/api/cancel/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

type Variant = "A" | "B";

function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return;
  try {
    const o = new URL(origin);
    if (o.host !== host) throw new Error("CSRF protection: invalid origin");
  } catch {
    throw new Error("CSRF protection: invalid origin");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    // 🔍 Debug: Try selecting existing cancellation
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("cancellations")
      .select("downsell_variant")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase SELECT error:", selectError); // 👈 add this
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    let variant: Variant;

    if (existing?.downsell_variant) {
      variant = existing.downsell_variant as Variant;
    } else {
      const rand = crypto.randomInt(0, 2);
      variant = rand === 0 ? "A" : "B";

      // 🔍 Debug: Try inserting cancellation
      const { error: insertError } = await supabaseAdmin
        .from("cancellations")
        .insert({
          user_id: userId,
          downsell_variant: variant,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Supabase INSERT error:", insertError); // 👈 add this
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ variant });
  } catch (e: any) {
    console.error("Session POST error:", e);
    return new NextResponse(e?.message || "Failed to start session", {
      status: 400,
    });
  }
}
