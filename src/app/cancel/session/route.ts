// src/app/api/cancel/session/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidUUID } from "@/lib/validate";
import crypto from "crypto";

type Variant = "A" | "B";

export async function POST(req: Request) {
  try {
    // 1️⃣ CSRF origin check
    const origin = req.headers.get("origin");
    if (origin && !origin.startsWith("http://localhost:3000")) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    // 2️⃣ Parse + validate
    const { userId } = await req.json();
    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // 3️⃣ Get subscription ID for user (needed for cancellations row)
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError || !subscription) {
      console.error("Subscription lookup error:", subError);
      return NextResponse.json(
        { error: "No subscription found for user" },
        { status: 404 }
      );
    }

    // 3️⃣ Check if cancellation already exists
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("cancellations")
      .select("downsell_variant")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase SELECT error:", selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    let variant: Variant;

    if (existing?.downsell_variant) {
      // Reuse existing variant
      variant = existing.downsell_variant as Variant;
    } else {
      // Randomize A/B split deterministically
      const rand = crypto.randomInt(0, 2);
      variant = rand === 0 ? "A" : "B";

      const { error: insertError } = await supabaseAdmin
        .from("cancellations")
        .upsert(
          {
            user_id: userId,
            subscription_id: subscription.id, // 👈 added
            downsell_variant: variant,
            created_at: new Date().toISOString(),
          },
          { onConflict: "user_id" } // 👈 ensures one row per user
        );

      if (insertError) {
        console.error("Supabase INSERT error:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ variant });
  } catch (err: any) {
    console.error("Session POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
